import { ListItemAvatarImageConfig } from "src/components/ListItemAvatar";

import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { collectionDetails } from "~/api/collections";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { Props } from "./Collection";

export async function getProps(slug: string): Promise<Props> {
  const { collection, distinctReleaseYears } = await collectionDetails(slug);

  collection.titles.sort((a, b) =>
    a.releaseSequence.localeCompare(b.releaseSequence),
  );

  return {
    avatarImageProps: await getAvatarImageProps(
      collection.slug,
      ListItemAvatarImageConfig,
    ),
    backdropImageProps: await getBackdropImageProps(
      collection.slug,
      BackdropImageConfig,
    ),
    distinctReleaseYears,
    initialSort: "release-date-asc",
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
    value: collection,
  };
}
