import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allWatchlistTitles } from "~/api/watchlist";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";

import type { WatchlistProps } from "./Watchlist";

export async function getWatchlistProps(): Promise<WatchlistProps> {
  const {
    distinctCollections,
    distinctDirectors,
    distinctGenres,
    distinctPerformers,
    distinctReleaseYears,
    distinctWriters,
    watchlistTitles,
  } = await allWatchlistTitles();

  const defaultPosterImageProps = await getFluidWidthPosterImageProps(
    "default",
    PosterListItemImageConfig,
  );

  return {
    defaultPosterImageProps,
    distinctCollections,
    distinctDirectors,
    distinctGenres,
    distinctPerformers,
    distinctReleaseYears,
    distinctWriters,
    initialSort: "title-asc",
    values: watchlistTitles,
  };
}
