import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildNameFilterChip } from "~/components/filter-and-sort/facets/name/buildNameFilterChip";

import type { CollectionsFiltersValues } from "./Collections.reducer";

export function buildAppliedFilterChips(
  filterValues: CollectionsFiltersValues,
): FilterChip[] {
  return [...buildNameFilterChip(filterValues.name)];
}
