import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { getUpdateStillProps } from "~/api/stills";

const gradeToStars: Record<string, number> = {
  A: 5,
  "A+": 5,
  "A-": 4.5,
  B: 4,
  "B+": 4,
  "B-": 3.5,
  C: 3,
  "C+": 3,
  "C-": 2.5,
  D: 2,
  "D+": 2,
  "D-": 1.5,
  F: 1,
  "F+": 1,
  "F-": 0.5,
};

/**
 * Astro endpoint handler for generating the updates JSON feed.
 * @returns JSON response with recent review updates
 */
export async function GET() {
  const reviews = await mostRecentReviews(5);

  const updateItems = await Promise.all(
    reviews.map(async (review) => {
      const stillProps = await getUpdateStillProps(review.slug);

      const reviewWithExcerptHtml = await loadExcerptHtml(review);

      return {
        date: review.reviewDate,
        excerpt: reviewWithExcerptHtml.excerpt,
        genres: review.genres,
        image: stillProps.src,
        slug: review.slug,
        stars: gradeToStars[review.grade],
        title: review.title,
        year: review.releaseYear,
      };
    }),
  );

  return Response.json(updateItems);
}
