import type { FilterChip } from "~/components/filter-and-sort/container/AppliedFiltersSection";

import { buildMultiSelectChips } from "~/facets/filterChipBuilders";

export function buildVenueFilterChip(
  values: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips({ id: "venue", values });
}
