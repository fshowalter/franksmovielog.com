import {
  allWatchlistTitlesJson,
  type WatchlistTitleJson,
} from "./data/watchlistTitlesJson";

export type WatchlistTitle = {} & WatchlistTitleJson;

type WatchlistTitles = {
  distinctCollections: string[];
  distinctDirectors: string[];
  distinctPerformers: string[];
  distinctReleaseYears: string[];
  distinctWriters: string[];
  watchlistTitles: WatchlistTitle[];
};

export async function allWatchlistTitles(): Promise<WatchlistTitles> {
  const watchlistTitlesJson = await allWatchlistTitlesJson();
  const distinctDirectors = new Set<string>();
  const distinctPerformers = new Set<string>();
  const distinctWriters = new Set<string>();
  const distinctCollections = new Set<string>();
  const distinctReleaseYears = new Set<string>();

  const watchlistTitles = watchlistTitlesJson.map((title) => {
    for (const name of title.directorNames) distinctDirectors.add(name);
    for (const name of title.performerNames) distinctPerformers.add(name);
    for (const name of title.writerNames) distinctWriters.add(name);
    for (const name of title.collectionNames) distinctCollections.add(name);
    distinctReleaseYears.add(title.year);

    return {
      ...title,
    };
  });

  return {
    distinctCollections: [...distinctCollections].toSorted(),
    distinctDirectors: [...distinctDirectors].toSorted(),
    distinctPerformers: [...distinctPerformers].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctWriters: [...distinctWriters].toSorted(),
    watchlistTitles,
  };
}
