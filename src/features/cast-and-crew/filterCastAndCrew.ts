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

function createCreditedAsFilter(filterValue?: string) {
  if (!filterValue) return;
  return (value: CastAndCrewValue) => {
    return value.creditedAs.includes(filterValue);
  };
}
