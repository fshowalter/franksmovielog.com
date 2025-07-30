import { ListItemAvatarImageConfig } from "src/components/ListItemAvatar";

import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { collectionDetails } from "~/api/collections";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { Props } from "./Collection";

export async function getProps(slug: string): Promise<Props> {
  const { collection, distinctReleaseYears, distinctReviewYears } =
    await collectionDetails(slug);

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
    distinctReviewYears,
    initialSort: "release-date-asc",
    titles: await Promise.all(
      collection.titles.map(async (title) => {
        return {
          ...title,
          posterImageProps: await getFluidWidthPosterImageProps(
            title.slug,
            ListItemPosterImageConfig,
          ),
          reviewDisplayDate: title.reviewDate
            ? `${new Date(title.reviewDate).toLocaleDateString("en-US", {
                timeZone: "UTC",
                year: "numeric",
              })}-${new Date(title.reviewDate).toLocaleDateString("en-US", {
                month: "short",
                timeZone: "UTC",
              })}-${new Date(title.reviewDate).toLocaleDateString("en-US", {
                day: "2-digit",
                timeZone: "UTC",
              })}`
            : "",
          reviewSequence: title.reviewSequence,
          reviewYear: title.reviewDate
            ? new Date(title.reviewDate).toLocaleDateString("en-US", {
                timeZone: "UTC",
                year: "numeric",
              })
            : "",
        };
      }),
    ),
    value: collection,
  };
}
