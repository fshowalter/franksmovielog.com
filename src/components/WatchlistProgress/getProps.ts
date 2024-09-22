import { getAvatarImageProps } from "src/api/avatars";
import { getBackdropImageProps } from "src/api/backdrops";
import { watchlistProgress } from "src/api/watchlistProgress";

import { BackdropImageConfig } from "../Backdrop";
import { ListItemAvatarImageConfig } from "../ListItemAvatar";
import type { Props } from "./WatchlistProgress";

export async function getProps(): Promise<Props> {
  const progress = await watchlistProgress();

  return {
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
              ListItemAvatarImageConfig,
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
              ListItemAvatarImageConfig,
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
              ListItemAvatarImageConfig,
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
              ListItemAvatarImageConfig,
            ),
          };
        }),
      ),
    },
  };
}
