import { filterCollections } from "~/filterers/filterCollections";

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewFiltersValues } from "./CastAndCrew.reducer";

export function filterCastAndCrewValues(
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
