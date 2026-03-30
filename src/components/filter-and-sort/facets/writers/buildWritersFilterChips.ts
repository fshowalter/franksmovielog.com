import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildMultiSelectChips } from "~/components/filter-and-sort/facets/filterChipBuilders";

import { STATE_KEY } from "./writersReducer";

export function buildWritersFilterChips(
  values: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips({
    key: STATE_KEY,
    label: "Writer",
    values: values,
  });
}
