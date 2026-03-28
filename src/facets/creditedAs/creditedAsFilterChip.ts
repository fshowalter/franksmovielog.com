import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { capitalize } from "~/utils/capitalize";

// AIDEV-NOTE: creditedAs values are lowercase ("director", "performer", "writer").
// Chips display a capitalized label but key uses the raw lowercase value.
export function buildCreditedAsFilterChip(
  values: readonly string[] | undefined,
): FilterChip[] {
  if (!values || values.length === 0) {
    return [];
  }
  return values.map((value) => ({
    displayText: capitalize(value),
    key: `creditedAs-${value.toLowerCase()}`,
    value,
  }));
}
