import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import type { CollectionsFiltersValues } from "./Collections.reducer";

/**
 * Builds an array of FilterChip objects from the current filter values.
 * Used to display active filters in the AppliedFilters component.
 *
 * @param filterValues - The current collection filter values
 * @returns Array of FilterChip objects representing active filters
 */
export function buildAppliedFilterChips(
  filterValues: CollectionsFiltersValues,
): FilterChip[] {
  const chips: FilterChip[] = [];

  // Name search filter
  if (filterValues.name && filterValues.name.trim() !== "") {
    chips.push({
      category: "Search",
      id: "name",
      label: filterValues.name,
    });
  }

  return chips;
}
