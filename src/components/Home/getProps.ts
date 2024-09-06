import { loadExcerptHtml, mostRecentReviews } from "src/api/reviews";
import { getStillImageProps } from "src/api/stills";

import type { Props } from "./Home";
import { StillImageConfig } from "./HomeListItem";

export async function getProps(): Promise<Props> {
  const titles = await mostRecentReviews(11);

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
          stillImageProps: await getStillImageProps(
            value.slug,
            StillImageConfig,
          ),
        };
      }),
    ),
  };
}
