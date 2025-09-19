import { createReleaseYearFilter } from "~/filterers/createReleaseYearFilter";
import { createReviewedStatusFilter } from "~/filterers/createReviewedStatusFilter";
import { createTitleFilter } from "~/filterers/createTitleFilter";
import { filterSortedValues } from "~/filterers/filterSortedValues";

import type { ViewingsValue } from "./Viewings";
import type { ViewingsFiltersValues } from "./Viewings.reducer";

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
