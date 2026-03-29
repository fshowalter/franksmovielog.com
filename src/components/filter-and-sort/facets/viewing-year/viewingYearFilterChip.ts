import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildYearRangeChip } from "~/components/filter-and-sort/facets/filterChipBuilders";

import { STATE_KEY } from "./viewingYearReducer";

export function buildViewingYearFilterChip(
  value: readonly [string, string] | undefined,
): FilterChip[] {
  return buildYearRangeChip({
    key: STATE_KEY,
    label: "Viewing Year",
    value,
  });
}
