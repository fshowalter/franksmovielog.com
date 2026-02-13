import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import type { CastAndCrewFiltersValues } from "./CastAndCrew.reducer";

/**
 * Builds an array of FilterChip objects from active filter values for the Cast & Crew page.
 *
 * Converts the structured filter values (name, creditedAs) into a flat array of chips
 * that can be displayed in the AppliedFilters component.
 *
 * @param filterValues - Current active filter values
 * @returns Array of FilterChip objects representing active filters
 *
 * @example
 * ```ts
 * buildAppliedFilterChips({
 *   name: "john",
 *   creditedAs: "director"
 * })
 * // Returns:
 * // [
 * // { id: "name", category: "Search", label: "john" },
 * //   { id: "creditedAs", category: "Credited As", label: "Director" }
 * // ]
 * ```
 */
export function buildAppliedFilterChips(
  filterValues: CastAndCrewFiltersValues,
): FilterChip[] {
  const chips: FilterChip[] = [];

  // Name search chip
  if (filterValues.name && filterValues.name.trim() !== "") {
    chips.push({
      category: "Search",
      id: "name",
      label: filterValues.name,
    });
  }

  // Credited As chips (multi-select)
  if (filterValues.creditedAs && filterValues.creditedAs.length > 0) {
    for (const role of filterValues.creditedAs) {
      // Capitalize the role (director -> Director, performer -> Performer, writer -> Writer)
      const label = role.charAt(0).toUpperCase() + role.slice(1);
      chips.push({
        category: "Credited As",
        id: `creditedAs-${role.toLowerCase()}`,
        label,
      });
    }
  }

  return chips;
}
