import { getBackdropImageProps } from "src/api/backdrops";
import { watchlistProgress } from "src/api/watchlistProgress";

import { BackdropImageConfig } from "../Backdrop";
import type { Props } from "./WatchlistProgress";

export async function getProps(): Promise<Props> {
  const progress = await watchlistProgress();

  return {
    backdropImageProps: await getBackdropImageProps(
      "watchlist-progress",
      BackdropImageConfig,
    ),
    progress,
  };
}
