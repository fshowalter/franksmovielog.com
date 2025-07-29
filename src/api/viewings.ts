import type { ViewingJson } from "./data/viewingsJson";

import { allViewingsJson } from "./data/viewingsJson";

export type Viewing = ViewingJson & {};

type Viewings = {
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
  const distinctMedia = new Set<string>();
  const distinctVenues = new Set<string>();

  const viewings = viewingsJson.map((title) => {
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
    distinctMedia: [...distinctMedia].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctVenues: [...distinctVenues].toSorted(),
    distinctViewingYears: [...distinctViewingYears].toSorted(),
    viewings: viewings,
  };
}
