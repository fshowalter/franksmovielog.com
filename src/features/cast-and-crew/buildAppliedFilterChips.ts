import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildCreditedAsFilterChips } from "~/components/filter-and-sort/facets/credited-as/creditedAsFilterChips";
import { buildNameFilterChip } from "~/components/filter-and-sort/facets/name/nameFilterChip";

import type { CastAndCrewFiltersValues } from "./CastAndCrew.reducer";

export function buildAppliedFilterChips(
  filterValues: CastAndCrewFiltersValues,
): FilterChip[] {
  return [
    ...buildNameFilterChip(filterValues.name),
    ...buildCreditedAsFilterChips(filterValues.creditedAs),
  ];
}
