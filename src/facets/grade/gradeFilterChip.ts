import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildGradeChip } from "~/facets/filterChipBuilders";

export function buildGradeFilterChip(
  gradeValue: readonly [number, number] | undefined,
): FilterChip[] {
  return buildGradeChip(gradeValue);
}
