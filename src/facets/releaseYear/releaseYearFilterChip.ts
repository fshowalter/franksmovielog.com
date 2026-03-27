import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildYearRangeChip } from "~/facets/filterChipBuilders";

import { STATE_KEY } from "./releaseYearReducer";

export function buildReleaseYearFilterChip(
  value: readonly [string, string] | undefined,
  distinctReleaseYears: readonly string[],
): FilterChip[] {
  return buildYearRangeChip({
    category: "Release Year",
    distinctYears: distinctReleaseYears,
    id: STATE_KEY,
    value,
  });
}
