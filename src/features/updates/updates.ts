import { getEntry } from "astro:content";

import { getUpdateStillProps } from "~/assets/stills";
import { mostRecentReviewedTitles } from "~/utils/mostRecentReviewedTitles";

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
export async function updates() {
  const reviewedTitles = await mostRecentReviewedTitles(5);

  const updateItems = await Promise.all(
    reviewedTitles.map(async ({ data: title }) => {
      const { data: review } = await getEntry(title.review);
      const stillProps = await getUpdateStillProps(review.slug);

      return {
        date: review.date,
        excerpt: review.excerptHtml,
        genres: title.genres,
        image: stillProps.src,
        slug: review.slug,
        stars: gradeToStars[review.grade],
        title: title.title,
        year: title.releaseYear,
      };
    }),
  );

  return Response.json(updateItems);
}
