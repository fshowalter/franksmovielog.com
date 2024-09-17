import { getAvatarImageProps } from "src/api/avatars";
import { getBackdropImageProps } from "src/api/backdrops";
import { collectionDetails } from "src/api/collections";
import { getFixedWidthPosterImageProps } from "src/api/posters";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import { BackdropImageConfig } from "../Backdrop";
import type { Props } from "./Collection";
import { AvatarImageConfig } from "./Header";

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
          posterImageProps: await getFixedWidthPosterImageProps(
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
