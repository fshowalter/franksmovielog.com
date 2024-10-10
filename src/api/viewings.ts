import type { ViewingJson } from "./data/viewingsJson";

import { allViewingsJson } from "./data/viewingsJson";

export type Viewing = {} & ViewingJson;

type Viewings = {
  distinctGenres: string[];
  distinctMedia: string[];
  distinctReleaseYears: string[];
  distinctVenues: string[];
  distinctViewingYears: string[];
  viewings: Viewing[];
};

export async function allViewings(): Promise<Viewings> {
  const viewingsJson = await allViewingsJson();
  const distinctViewingYears = new Set<string>();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();
  const distinctMedia = new Set<string>();
  const distinctVenues = new Set<string>();

  const viewings = viewingsJson.map((title) => {
    title.genres.forEach((genre) => distinctGenres.add(genre));
    distinctReleaseYears.add(title.year);
    distinctViewingYears.add(title.viewingYear);
    if (title.medium) {
      distinctMedia.add(title.medium);
    }
    if (title.venue) {
      distinctVenues.add(title.venue);
    }

    return {
      ...title,
    };
  });

  return {
    distinctGenres: Array.from(distinctGenres).toSorted(),
    distinctMedia: Array.from(distinctMedia).toSorted(),
    distinctReleaseYears: Array.from(distinctReleaseYears).toSorted(),
    distinctVenues: Array.from(distinctVenues).toSorted(),
    distinctViewingYears: Array.from(distinctViewingYears).toSorted(),
    viewings: viewings,
  };
}
