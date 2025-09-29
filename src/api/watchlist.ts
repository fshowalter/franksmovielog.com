import { collator } from "~/utils/collator";

import type { WatchlistProgressJson } from "./data/watchlist-progress-json";
import type { WatchlistTitleJson } from "./data/watchlist-titles-json";

import { watchlistProgressJson } from "./data/watchlist-progress-json";
import { allWatchlistTitlesJson } from "./data/watchlist-titles-json";
import { createReleaseSequenceMap } from "./utils/createReleaseSequenceMap";

/**
 * Watchlist progress statistics.
 */
export type WatchlistProgress = WatchlistProgressJson & {};

type WatchlistTitle = WatchlistTitleJson & {};

type WatchlistTitles = {
  distinctCollections: string[];
  distinctDirectors: string[];
  distinctGenres: string[];
  distinctPerformers: string[];
  distinctReleaseYears: string[];
  distinctWriters: string[];
  watchlistTitles: WatchlistTitle[];
};

/**
 * Retrieves all watchlist titles with distinct metadata for filtering.
 * @returns Object containing watchlist titles and distinct values for directors, genres, performers, etc.
 */
export async function allWatchlistTitles(): Promise<WatchlistTitles> {
  const watchlistTitlesJson = await allWatchlistTitlesJson();
  const distinctDirectors = new Set<string>();
  const distinctGenres = new Set<string>();
  const distinctPerformers = new Set<string>();
  const distinctWriters = new Set<string>();
  const distinctCollections = new Set<string>();
  const distinctReleaseYears = new Set<string>();

  const releaseSequenceMap = createReleaseSequenceMap(watchlistTitlesJson);

  const watchlistTitles = watchlistTitlesJson.map((title) => {
    for (const name of title.watchlistDirectorNames)
      distinctDirectors.add(name);
    for (const name of title.watchlistPerformerNames)
      distinctPerformers.add(name);
    for (const name of title.watchlistWriterNames) distinctWriters.add(name);
    for (const name of title.watchlistCollectionNames)
      distinctCollections.add(name);
    for (const genre of title.genres) distinctGenres.add(genre);
    distinctReleaseYears.add(title.releaseYear);

    return {
      ...title,
      releaseSequence: releaseSequenceMap.get(title.imdbId)!,
    };
  });

  return {
    distinctCollections: [...distinctCollections].toSorted((a, b) =>
      collator.compare(a, b),
    ),
    distinctDirectors: [...distinctDirectors].toSorted((a, b) =>
      collator.compare(a, b),
    ),
    distinctGenres: [...distinctGenres].toSorted((a, b) =>
      collator.compare(a, b),
    ),
    distinctPerformers: [...distinctPerformers].toSorted((a, b) =>
      collator.compare(a, b),
    ),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctWriters: [...distinctWriters].toSorted((a, b) =>
      collator.compare(a, b),
    ),
    watchlistTitles,
  };
}

/**
 * Retrieves watchlist progress statistics.
 * @returns Watchlist progress data including counts and completion metrics
 */
export async function watchlistProgress(): Promise<WatchlistProgress> {
  return await watchlistProgressJson();
}
