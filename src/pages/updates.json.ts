import { getUpdatePosterProps } from "~/api/posters";
import { mostRecentReviews } from "~/api/reviews";

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

export async function GET() {
  const reviews = await mostRecentReviews(6);

  const updateItems = await Promise.all(
    reviews.map(async (review) => {
      const posterProps = await getUpdatePosterProps(review.slug);

      return {
        date: review.date,
        image: posterProps.src,
        slug: review.slug,
        stars: gradeToStars[review.grade],
        title: review.title,
        year: review.year,
      };
    }),
  );

  return new Response(JSON.stringify(updateItems));
}
