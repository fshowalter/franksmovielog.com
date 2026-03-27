import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildSearchChip } from "~/facets/filterChipBuilders";

export function buildNameFilterChip(
  name: string | undefined,
): FilterChip[] {
  return buildSearchChip({ id: "name", value: name });
}
