import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { watchlistProgress } from "~/api/watchlist";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";

import type { WatchlistProgressProps } from "./WatchlistProgress";

import { WatchlistProgressForGroupAvatarImageConfig } from "./WatchlistProgressForGroup";

export async function getProps(): Promise<
  WatchlistProgressProps & { metaDescription: string }
> {
  const progress = await watchlistProgress();

  return {
    backdropImageProps: await getBackdropImageProps(
      "watchlist-progress",
      BackdropImageConfig,
    ),
    deck: '"I find your lack of faith disturbing."',
    metaDescription:
      "My progress working through my to-review watchlist. Overall and individual percentage breakdowns by director, writer, performer, and collection.",
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
