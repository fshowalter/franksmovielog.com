import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allWatchlistTitles } from "~/api/watchlist";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";

import type { WatchlistProps } from "./Watchlist";

/**
 * Fetches data for the watchlist page including titles and filter metadata.
 * @returns Props for the Watchlist component with all watchlist titles
 */
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
