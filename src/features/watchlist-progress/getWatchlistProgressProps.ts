import { getAvatarImageProps } from "~/api/avatars";
import { watchlistProgress } from "~/api/watchlist";

import type { WatchlistProgressProps } from "./WatchlistProgress";

import { WatchlistProgressForGroupAvatarImageConfig } from "./WatchlistProgressForGroup";

export async function getWatchlistProgressProps(): Promise<WatchlistProgressProps> {
  const progress = await watchlistProgress();

  return {
    progress: {
      ...progress,
      collectionDetails: await Promise.all(
        progress.collectionDetails.map(async (detail) => {
          return {
            ...detail,
            avatarImageProps: await getAvatarImageProps(
              detail.slug,
              WatchlistProgressForGroupAvatarImageConfig,
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
              WatchlistProgressForGroupAvatarImageConfig,
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
              WatchlistProgressForGroupAvatarImageConfig,
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
              WatchlistProgressForGroupAvatarImageConfig,
            ),
          };
        }),
      ),
    },
  };
}
