import { createCreditedAsFilter } from "~/components/filter-and-sort/facets/credited-as/creditedAsFilter";
import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createNameFilter } from "~/components/filter-and-sort/facets/name/nameFilter";

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewFiltersValues } from "./castAndCrewReducer";

/**
 * Filters cast and crew members based on credited role and name.
 * @param sortedValues - Array of cast/crew members to filter
 * @param filterValues - Object containing filter values including creditedAs and name
 * @returns Filtered array of cast/crew members
 */
export function filterCastAndCrew(
  sortedValues: readonly CastAndCrewValue[],
  filterValues: CastAndCrewFiltersValues,
) {
  const filters = [
    createNameFilter(filterValues),
    createCreditedAsFilter(filterValues),
  ].filter((f) => f !== undefined);

  return filterSortedValues({ filters, sortedValues });
}
