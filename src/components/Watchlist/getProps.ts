import { getBackdropImageProps } from "src/api/backdrops";
import { getFixedWidthPosterImageProps } from "src/api/posters";
import { allWatchlistTitles } from "src/api/watchlistTitles";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import { BackdropImageConfig } from "../Backdrop";
import type { Props } from "./Watchlist";

export async function getProps(): Promise<Props> {
  const {
    watchlistTitles,
    distinctCollections,
    distinctDirectors,
    distinctPerformers,
    distinctReleaseYears,
    distinctWriters,
  } = await allWatchlistTitles();

  const defaultPosterImageProps = await getFixedWidthPosterImageProps(
    "default",
    ListItemPosterImageConfig,
  );

  watchlistTitles.sort((a, b) =>
    a.releaseSequence.localeCompare(b.releaseSequence),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "watchlist",
      BackdropImageConfig,
    ),
    values: watchlistTitles,
    distinctCollections,
    distinctDirectors,
    distinctPerformers,
    distinctWriters,
    distinctReleaseYears,
    defaultPosterImageProps,
    initialSort: "release-date-asc",
  };
}
