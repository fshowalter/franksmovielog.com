import { getBackdropImageProps } from "src/api/backdrops";
import { collectionDetails } from "src/api/collections";
import { getFluidWidthPosterImageProps } from "src/api/posters";
import { BackdropImageConfig } from "src/components/Backdrop";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { Props } from "./Collection";

export async function getProps(slug: string): Promise<Props> {
  const { collection, distinctReleaseYears } = await collectionDetails(slug);

  collection.titles.sort((a, b) =>
    a.releaseSequence.localeCompare(b.releaseSequence),
  );

  return {
    value: collection,
    titles: await Promise.all(
      collection.titles.map(async (title) => {
        return {
          ...title,
          posterImageProps: await getFluidWidthPosterImageProps(
            title.slug,
            ListItemPosterImageConfig,
          ),
        };
      }),
    ),
    backdropImageProps: await getBackdropImageProps(
      collection.slug,
      BackdropImageConfig,
    ),
    distinctReleaseYears,
    initialSort: "release-date-asc",
  };
}
