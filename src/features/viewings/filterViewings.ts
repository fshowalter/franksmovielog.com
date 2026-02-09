import { createReleaseYearFilter } from "~/filterers/createReleaseYearFilter";
import { createReviewedStatusFilter } from "~/filterers/createReviewedStatusFilter";
import { createTitleFilter } from "~/filterers/createTitleFilter";
import { filterSortedValues } from "~/filterers/filterSortedValues";

import type { ViewingsValue } from "./Viewings";
import type { ViewingsFiltersValues } from "./Viewings.reducer";

/**
 * Calculates the count of viewings for each medium type.
 * Excludes the medium filter when calculating counts, but respects all other active filters.
 * @param values - Array of all viewings
 * @param filterValues - Current active filter values
 * @returns Map of medium name to count
 */
export function calculateMediumCounts(
  values: ViewingsValue[],
  filterValues: ViewingsFiltersValues,
): Map<string, number> {
  // Create filter values without medium filter
  const filtersWithoutMedium: ViewingsFiltersValues = {
    ...filterValues,
    medium: undefined,
  };

  // Filter viewings with all filters except medium
  const filteredValues = filterViewings(values, filtersWithoutMedium);

  // Count occurrences of each medium
  const counts = new Map<string, number>();
  for (const value of filteredValues) {
    if (value.medium) {
      counts.set(value.medium, (counts.get(value.medium) ?? 0) + 1);
    }
  }

  return counts;
}

/**
 * Calculates the count of viewings for each reviewed status.
 * Excludes the reviewedStatus filter when calculating counts, but respects all other active filters.
 * @param values - Array of all viewings
 * @param filterValues - Current active filter values
 * @returns Map of reviewed status to count ("All", "Reviewed", "Not Reviewed")
 */
export function calculateReviewedStatusCounts(
  values: ViewingsValue[],
  filterValues: ViewingsFiltersValues,
): Map<string, number> {
  // Create filter values without reviewedStatus filter
  const filtersWithoutReviewedStatus: ViewingsFiltersValues = {
    ...filterValues,
    reviewedStatus: undefined,
  };

  // Filter viewings with all filters except reviewedStatus
  const filteredValues = filterViewings(
    values,
    filtersWithoutReviewedStatus,
  );

  // Count reviewed vs not reviewed
  let reviewedCount = 0;
  let notReviewedCount = 0;

  for (const value of filteredValues) {
    if (value.slug) {
      reviewedCount++;
    } else {
      notReviewedCount++;
    }
  }

  return new Map([
    ["All", filteredValues.length],
    ["Not Reviewed", notReviewedCount],
    ["Reviewed", reviewedCount],
  ]);
}

/**
 * Calculates the count of viewings for each venue.
 * Excludes the venue filter when calculating counts, but respects all other active filters.
 * @param values - Array of all viewings
 * @param filterValues - Current active filter values
 * @returns Map of venue name to count
 */
export function calculateVenueCounts(
  values: ViewingsValue[],
  filterValues: ViewingsFiltersValues,
): Map<string, number> {
  // Create filter values without venue filter
  const filtersWithoutVenue: ViewingsFiltersValues = {
    ...filterValues,
    venue: undefined,
  };

  // Filter viewings with all filters except venue
  const filteredValues = filterViewings(values, filtersWithoutVenue);

  // Count occurrences of each venue
  const counts = new Map<string, number>();
  for (const value of filteredValues) {
    if (value.venue) {
      counts.set(value.venue, (counts.get(value.venue) ?? 0) + 1);
    }
  }

  return counts;
}

/**
 * Filters viewings based on multiple criteria including venue, medium, and viewing year.
 * @param sortedValues - Array of viewings to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of viewings
 */
export function filterViewings(
  sortedValues: ViewingsValue[],
  filterValues: ViewingsFiltersValues,
) {
  const filters = [
    createReviewedStatusFilter(filterValues.reviewedStatus),
    createViewingYearFilter(filterValues.viewingYear),
    createVenueFilter(filterValues.venue),
    createMediumFilter(filterValues.medium),
    createTitleFilter(filterValues.title),
    createReleaseYearFilter(filterValues.releaseYear),
  ].filter((filterFn) => filterFn !== undefined);

  return filterSortedValues({ filters, sortedValues });
}

function createMediumFilter(filterValue?: string) {
  if (!filterValue) return;
  return (value: ViewingsValue) => {
    return value.medium === filterValue;
  };
}

function createVenueFilter(filterValue?: string) {
  if (!filterValue) return;
  return (value: ViewingsValue) => {
    return value.venue === filterValue;
  };
}

function createViewingYearFilter(filterValue?: [string, string]) {
  if (!filterValue) return;
  return (value: ViewingsValue): boolean => {
    return (
      value.viewingYear >= filterValue[0] && value.viewingYear <= filterValue[1]
    );
  };
}
