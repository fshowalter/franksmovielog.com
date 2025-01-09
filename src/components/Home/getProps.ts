import { getBackdropImageProps } from "~/api/backdrops";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { getStillImageProps } from "~/api/stills";
import { BackdropImageConfig } from "~/components/Backdrop";

import type { Props } from "./Home";

import { StillImageConfig } from "./HomeListItem";

export async function getProps(): Promise<Props> {
  const titles = await mostRecentReviews(12);

  const values = titles.map((review) => {
    return loadExcerptHtml(review);
  });

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
