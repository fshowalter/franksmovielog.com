import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { watchlistProgress } from "~/api/watchlistProgress";
import { BackdropImageConfig } from "~/components/Backdrop";

import type { Props } from "./WatchlistProgress";

import { DetailsAvatarImageConfig } from "./Details";

export async function getProps(): Promise<Props> {
  const progress = await watchlistProgress();

  return {
    backdropImageProps: await getBackdropImageProps(
      "watchlist-progress",
      BackdropImageConfig,
    ),
    deck: '"I find your lack of faith disturbing."',
    progress: {
      ...progress,
      collectionDetails: await Promise.all(
        progress.collectionDetails.map(async (detail) => {
          return {
            ...detail,
            avatarImageProps: await getAvatarImageProps(
              detail.slug,
              DetailsAvatarImageConfig,
            ),
          };
        }),
      ),
      directorDetails: await Promise.all(
        progress.directorDetails.map(async (detail) => {
          return {
            ...detail,
            avatarImageProps: await getAvatarImageProps(
              detail.slug,
              DetailsAvatarImageConfig,
            ),
          };
        }),
      ),
      performerDetails: await Promise.all(
        progress.performerDetails.map(async (detail) => {
          return {
            ...detail,
            avatarImageProps: await getAvatarImageProps(
              detail.slug,
              DetailsAvatarImageConfig,
            ),
          };
        }),
      ),
      writerDetails: await Promise.all(
        progress.writerDetails.map(async (detail) => {
          return {
            ...detail,
            avatarImageProps: await getAvatarImageProps(
              detail.slug,
              DetailsAvatarImageConfig,
            ),
          };
        }),
      ),
    },
  };
}
