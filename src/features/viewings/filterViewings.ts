import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createMediumFilter } from "~/components/filter-and-sort/facets/medium/mediumFilter";
import { createReleaseYearFilter } from "~/components/filter-and-sort/facets/release-year/releaseYearFilter";
import { createReviewedStatusFilter } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilter";
import { createTitleFilter } from "~/components/filter-and-sort/facets/title/titleFilter";
import { createVenueFilter } from "~/components/filter-and-sort/facets/venue/venueFilter";
import { createViewingYearFilter } from "~/components/filter-and-sort/facets/viewing-year/viewingYearFilter";

import type { ViewingsValue } from "./Viewings";
import type { ViewingsFiltersValues } from "./viewingsReducer";

/**
 * Filters viewings based on multiple criteria including venue, medium, and viewing year.
 * @param sortedValues - Array of viewings to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of viewings
 */
export function filterViewings(
  sortedValues: readonly ViewingsValue[],
  filterValues: ViewingsFiltersValues,
) {
  const filters = [
    createReviewedStatusFilter(filterValues),
    createViewingYearFilter(filterValues),
    createVenueFilter(filterValues),
    createMediumFilter(filterValues),
    createTitleFilter(filterValues),
    createReleaseYearFilter(filterValues),
  ].filter((filterFn) => filterFn !== undefined);

  return filterSortedValues({ filters, sortedValues });
}
