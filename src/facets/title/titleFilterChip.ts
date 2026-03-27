import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildSearchChip } from "~/facets/filterChipBuilders";

import { STATE_KEY } from "./titleReducer";

export function buildTitleFilterChip(
  title: string | undefined,
): FilterChip[] {
  return buildSearchChip({ id: STATE_KEY, value: title });
}
