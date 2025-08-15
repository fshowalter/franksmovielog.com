import { ListItemAvatarImageConfig } from "src/components/ListItemAvatar";

import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";

import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { collectionDetails } from "~/api/collections";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";
import { displayDate } from "~/utils/displayDate";

import type { Props } from "./Collection";

type PageProps = Props & {
  avatarImageProps: AvatarImageProps | undefined;
  backdropImageProps: BackdropImageProps;
};

export async function getProps(slug: string): Promise<PageProps> {
  const { collection, distinctReleaseYears, distinctReviewYears } =
    await collectionDetails(slug);

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
      collection.titles
        .sort((a, b) => a.releaseSequence.localeCompare(b.releaseSequence))
        .map(async (title) => {
          return {
            ...title,
            posterImageProps: await getFluidWidthPosterImageProps(
              title.slug,
              ListItemPosterImageConfig,
            ),
            reviewDisplayDate: displayDate(title.reviewDate),
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
