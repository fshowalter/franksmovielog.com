import type { FilterChip } from "~/components/filter-and-sort/container/AppliedFiltersSection";

import { buildSearchChip } from "~/facets/filterChipBuilders";

import type { CollectionsFiltersValues } from "./Collections.reducer";

export function buildAppliedFilterChips(
  filterValues: CollectionsFiltersValues,
): FilterChip[] {
  return [...buildSearchChip({ id: "name", value: filterValues.name })];
}
