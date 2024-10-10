import { getBackdropImageProps } from "src/api/backdrops";
import { loadExcerptHtml, mostRecentReviews } from "src/api/reviews";
import { getStillImageProps } from "src/api/stills";
import { BackdropImageConfig } from "src/components/Backdrop";

import type { Props } from "./Home";

import { StillImageConfig } from "./HomeListItem";

export async function getProps(): Promise<Props> {
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
          stillImageProps: await getStillImageProps(
            value.slug,
            StillImageConfig,
          ),
        };
      }),
    ),
  };
}
