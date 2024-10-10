import { getAvatarImageProps } from "src/api/avatars";
import { getBackdropImageProps } from "src/api/backdrops";
import { watchlistProgress } from "src/api/watchlistProgress";
import { BackdropImageConfig } from "src/components/Backdrop";

import { DetailsAvatarImageConfig } from "./Details";
import type { Props } from "./WatchlistProgress";

export async function getProps(): Promise<Props> {
  const progress = await watchlistProgress();

  return {
    deck: '"I find your lack of faith disturbing."',
    backdropImageProps: await getBackdropImageProps(
      "watchlist-progress",
      BackdropImageConfig,
    ),
    progress: {
      ...progress,
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
    },
  };
}
