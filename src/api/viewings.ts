import { collator } from "~/utils/reducerUtils";

import type { ViewingJson } from "./data/viewingsJson";

import { allViewingsJson } from "./data/viewingsJson";

export type Viewing = ViewingJson & {
  viewingYear: string;
};

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
    const viewingYear = title.viewingDate.slice(0, 4);
    distinctReleaseYears.add(title.releaseYear);
    distinctViewingYears.add(viewingYear);
    if (title.medium) {
      distinctMedia.add(title.medium);
    }
    if (title.venue) {
      distinctVenues.add(title.venue);
    }

    return {
      ...title,
      viewingYear,
    };
  });

  return {
    distinctMedia: [...distinctMedia].sort((a, b) => collator.compare(a, b)),
    distinctReleaseYears: [...distinctReleaseYears].sort((a, b) =>
      collator.compare(a, b),
    ),
    distinctVenues: [...distinctVenues].sort((a, b) => collator.compare(a, b)),
    distinctViewingYears: [...distinctViewingYears].sort((a, b) =>
      collator.compare(a, b),
    ),
    viewings: viewings,
  };
}
