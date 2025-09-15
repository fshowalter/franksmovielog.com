import { getBackdropImageProps } from "~/api/backdrops";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { getStillImageProps } from "~/api/stills";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";

import type { HomeProps } from "./Home";

import { HomeStillImageConfig } from "./Home";

export async function getProps(): Promise<HomeProps> {
  const titles = await mostRecentReviews(12);

  const values = await Promise.all(
    titles.map(async (review) => {
      return await loadExcerptHtml(review);
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "home",
      BackdropImageConfig,
    ),
    deck: "Quality reviews of films of questionable quality.",
    values: await Promise.all(
      values.map(async (value) => {
        return {
          ...value,
          reviewDisplayDate: formatDate(value.reviewDate),
          stillImageProps: await getStillImageProps(
            value.slug,
            HomeStillImageConfig,
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
