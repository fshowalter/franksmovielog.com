import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildCreditedAsFilterChip } from "~/facets/creditedAs/creditedAsFilterChip";
import { buildSearchChip } from "~/facets/filterChipBuilders";

import type { CastAndCrewFiltersValues } from "./CastAndCrew.reducer";

export function buildAppliedFilterChips(
  filterValues: CastAndCrewFiltersValues,
): FilterChip[] {
  return [
    ...buildSearchChip({ id: "name", value: filterValues.name }),
    ...buildCreditedAsFilterChip(filterValues.creditedAs),
  ];
}
