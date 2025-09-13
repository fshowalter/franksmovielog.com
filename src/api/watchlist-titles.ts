import { collator } from "~/utils/collator";

import {
  allWatchlistTitlesJson,
  type WatchlistTitleJson,
} from "./data/watchlistTitlesJson";

export type WatchlistTitle = WatchlistTitleJson & {};

type WatchlistTitles = {
  distinctCollections: string[];
  distinctDirectors: string[];
  distinctGenres: string[];
  distinctPerformers: string[];
  distinctReleaseYears: string[];
  distinctWriters: string[];
  watchlistTitles: WatchlistTitle[];
};

export async function allWatchlistTitles(): Promise<WatchlistTitles> {
  const watchlistTitlesJson = await allWatchlistTitlesJson();
  const distinctDirectors = new Set<string>();
  const distinctGenres = new Set<string>();
  const distinctPerformers = new Set<string>();
  const distinctWriters = new Set<string>();
  const distinctCollections = new Set<string>();
  const distinctReleaseYears = new Set<string>();

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
    };
  });

  return {
    distinctCollections: [...distinctCollections].sort((a, b) =>
      collator.compare(a, b),
    ),
    distinctDirectors: [...distinctDirectors].sort((a, b) =>
      collator.compare(a, b),
    ),
    distinctGenres: [...distinctGenres].sort((a, b) => collator.compare(a, b)),
    distinctPerformers: [...distinctPerformers].sort((a, b) =>
      collator.compare(a, b),
    ),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctWriters: [...distinctWriters].sort((a, b) =>
      collator.compare(a, b),
    ),
    watchlistTitles,
  };
}
