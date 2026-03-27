import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildYearRangeChip } from "~/facets/filterChipBuilders";

import { STATE_KEY } from "./reviewYearReducer";

export function buildReviewYearFilterChip(
  value: readonly [string, string] | undefined,
  distinctReviewYears: readonly string[],
): FilterChip[] {
  return buildYearRangeChip({
    category: "Review Year",
    distinctYears: distinctReviewYears,
    id: STATE_KEY,
    value,
  });
}
