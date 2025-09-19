import { collator } from "~/utils/collator";

import type { ViewingJson } from "./data/viewings-json";

import { allViewingsJson } from "./data/viewings-json";

type Viewing = ViewingJson & {
  viewingYear: string;
};

type Viewings = {
  distinctMedia: string[];
  distinctReleaseYears: string[];
  distinctVenues: string[];
  distinctViewingYears: string[];
  viewings: Viewing[];
};

/**
 * Retrieves all viewings with distinct metadata for filtering.
 * @returns Object containing all viewings and distinct values for years, media, and venues
 */
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
    distinctMedia: [...distinctMedia].toSorted((a, b) =>
      collator.compare(a, b),
    ),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctVenues: [...distinctVenues].toSorted((a, b) =>
      collator.compare(a, b),
    ),
    distinctViewingYears: [...distinctViewingYears].toSorted(),
    viewings: viewings,
  };
}
