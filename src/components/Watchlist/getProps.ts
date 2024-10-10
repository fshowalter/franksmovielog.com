import { getBackdropImageProps } from "src/api/backdrops";
import { getFixedWidthPosterImageProps } from "src/api/posters";
import { allWatchlistTitles } from "src/api/watchlistTitles";
import { BackdropImageConfig } from "src/components/Backdrop";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { Props } from "./Watchlist";

export async function getProps(): Promise<Props> {
  const {
    distinctCollections,
    distinctDirectors,
    distinctPerformers,
    distinctReleaseYears,
    distinctWriters,
    watchlistTitles,
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
    deck: `"A man's got to know his limitations"`,
    defaultPosterImageProps,
    distinctCollections,
    distinctDirectors,
    distinctPerformers,
    distinctReleaseYears,
    distinctWriters,
    initialSort: "release-date-asc",
    values: watchlistTitles,
  };
}
