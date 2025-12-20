import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { getStillImageProps } from "~/api/stills";
import { ReviewCardListImageConfig } from "~/components/review-card-list/ReviewCardList";

import type { HomeProps } from "./Home";

/**
 * Fetches data for the home page including recent reviews with excerpts and still images.
 * @returns Props for the Home component with 12 most recent reviews
 */
export async function getHomeProps(): Promise<HomeProps> {
  const titles = await mostRecentReviews(12);

  const values = await Promise.all(
    titles.map(async (review) => {
      return await loadExcerptHtml(review);
    }),
  );

  return {
    values: await Promise.all(
      values.map(async (value) => {
        return {
          ...value,
          reviewDisplayDate: formatDate(value.reviewDate),
          stillImageProps: await getStillImageProps(
            value.slug,
            ReviewCardListImageConfig,
          ),
        };
      }),
    ),
  };
}

function formatDate(reviewDate: Date): string {
  return reviewDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });
}
