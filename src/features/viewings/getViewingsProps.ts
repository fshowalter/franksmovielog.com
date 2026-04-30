import type { CollectionEntry } from "astro:content";

import { getFluidWidthPosterImageProps } from "~/assets/posters";
import { toSortDate } from "~/utils/toSortDate";
import { toSortYear } from "~/utils/toSortYear";

import type { ViewingsProps, ViewingsValue } from "./Viewings";

import { sortViewings } from "./sortViewings";

/**
 * Fetches data for the viewings page including poster images and metadata.
 * @returns Props for the Viewings component with all viewings sorted by date
 */
export async function getViewingLogProps(
  viewingLogEntries: CollectionEntry<"viewingLog">["data"][],
): Promise<ViewingsProps> {
  const distinctMedia = new Set<string>();
  const distinctVenues = new Set<string>();
  const distinctViewingYears = new Set<string>();
  const distinctReleaseYears = new Set<string>();

  const values = await Promise.all(
    viewingLogEntries.map(async (entry) => {
      if (entry.medium) {
        distinctMedia.add(entry.medium);
      }

      if (entry.venue) {
        distinctVenues.add(entry.venue);
      }
      distinctViewingYears.add(toSortYear(entry.date));
      distinctReleaseYears.add(entry.releaseYear);

      const value: ViewingsValue = {
        date: toSortDate(entry.date),
        posterImageProps: await getFluidWidthPosterImageProps(entry.reviewSlug),
        releaseYear: entry.releaseYear,
        sequence: entry.sequence,
        sortTitle: entry.sortTitle,
        title: entry.title,
        viewingYear: toSortYear(entry.date),
        ...(entry.medium && { medium: entry.medium }),
        ...(entry.venue && { venue: entry.venue }),
        ...(entry.reviewSlug && { reviewSlug: entry.reviewSlug }),
      };

      return value;
    }),
  );

  return {
    distinctMedia: [...distinctMedia].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctVenues: [...distinctVenues].toSorted(),
    distinctViewingYears: [...distinctViewingYears].toSorted(),
    initialSort: "viewing-date-desc",
    values: sortViewings(values, "viewing-date-desc"),
  };
}
