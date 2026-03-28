import type { FilterChip } from "~/components/filter-and-sort/container/AppliedFiltersSection";

import { buildMultiSelectChips } from "~/facets/filterChipBuilders";

// AIDEV-NOTE: id is "reviewedStatus" so chip ids are "reviewedStatus-reviewed" and "reviewedStatus-not-reviewed"
// category "Reviewed Status" doesn't include "Grade" or "Year" and isn't "Search",
// so ARIA label is just the label: e.g. "Remove Reviewed filter"
export function buildReviewedStatusFilterChip(
  values: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips({ id: "reviewedStatus", values });
}
