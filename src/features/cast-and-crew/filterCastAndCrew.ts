import { filterCollections } from "~/filterers/filterCollections";

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewFiltersValues } from "./CastAndCrew.reducer";

/**
 * Filters cast and crew members based on credited role and name.
 * @param sortedValues - Array of cast/crew members to filter
 * @param filterValues - Object containing filter values including creditedAs and name
 * @returns Filtered array of cast/crew members
 */
export function filterCastAndCrew(
  sortedValues: CastAndCrewValue[],
  filterValues: CastAndCrewFiltersValues,
) {
  const extraFilters = [createCreditedAsFilter(filterValues.creditedAs)].filter(
    (filterFn) => filterFn !== undefined,
  );

  return filterCollections(filterValues, sortedValues, extraFilters);
}

/**
 * Calculates counts for each credited role, excluding the creditedAs filter.
 * @param values - Array of cast/crew members
 * @param filterValues - Current filter values (creditedAs filter is excluded from counting)
 * @returns Map of credit role to count
 */
export function calculateCreditedAsCounts(
  values: CastAndCrewValue[],
  filterValues: CastAndCrewFiltersValues,
): Map<string, number> {
  // Apply all filters except creditedAs
  const filtersWithoutCreditedAs: CastAndCrewFiltersValues = {
    ...filterValues,
    creditedAs: undefined,
  };

  const filtered = filterCastAndCrew(values, filtersWithoutCreditedAs);

  // Count how many cast/crew members have each credited role
  const counts = new Map<string, number>();

  for (const value of filtered) {
    for (const credit of value.creditedAs) {
      counts.set(credit, (counts.get(credit) ?? 0) + 1);
    }
  }

  return counts;
}

function createCreditedAsFilter(filterValue?: string) {
  if (!filterValue) return;
  return (value: CastAndCrewValue) => {
    return value.creditedAs.includes(filterValue);
  };
}
