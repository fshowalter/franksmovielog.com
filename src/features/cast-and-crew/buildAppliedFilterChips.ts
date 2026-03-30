import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildCreditedAsFilterChips } from "~/components/filter-and-sort/facets/credited-as/buildCreditedAsFilterChips";
import { buildNameFilterChip } from "~/components/filter-and-sort/facets/name/buildNameFilterChip";

import type { CastAndCrewFiltersValues } from "./castAndCrewReducer";

export function buildAppliedFilterChips(
  filterValues: CastAndCrewFiltersValues,
): FilterChip[] {
  return [
    ...buildNameFilterChip(filterValues.name),
    ...buildCreditedAsFilterChips(filterValues.creditedAs),
  ];
}
