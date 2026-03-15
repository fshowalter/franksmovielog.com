import type { CollectionEntry } from "astro:content";

import { getFluidWidthPosterImageProps } from "~/assets/posters";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";

import type { WatchlistProps } from "./Watchlist";

/**
 * Fetches data for the watchlist page including titles and filter metadata.
 * @returns Props for the Watchlist component with all watchlist titles
 */
export async function getWatchlistProps(
  watchlistTitles: CollectionEntry<"watchlistTitles">["data"][],
): Promise<WatchlistProps> {
  const distinctCollections = new Set<string>();
  const distinctDirectors = new Set<string>();
  const distinctGenres = new Set<string>();
  const distinctPerformers = new Set<string>();
  const distinctReleaseYears = new Set<string>();
  const distinctWriters = new Set<string>();

  const defaultPosterImageProps = await getFluidWidthPosterImageProps(
    "default",
    PosterListItemImageConfig,
  );

  watchlistTitles.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

  const values = watchlistTitles.map((title, index) => {
    for (const name of title.watchlistDirectorNames) {
      distinctDirectors.add(name);
    }
    for (const name of title.watchlistPerformerNames) {
      distinctPerformers.add(name);
    }
    for (const name of title.watchlistWriterNames) {
      distinctWriters.add(name);
    }
    for (const name of title.watchlistCollectionNames) {
      distinctCollections.add(name);
    }
    for (const genre of title.genres) {
      distinctGenres.add(genre);
    }

    distinctReleaseYears.add(title.releaseYear);

    return {
      ...title,
      releaseSequence: index,
    };
  });

  return {
    defaultPosterImageProps,
    distinctCollections: [...distinctCollections].toSorted(),
    distinctDirectors: [...distinctDirectors].toSorted(),
    distinctGenres: [...distinctGenres].toSorted(),
    distinctPerformers: [...distinctPerformers].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctWriters: [...distinctWriters].toSorted(),
    initialSort: "title-asc",
    values,
  };
}
