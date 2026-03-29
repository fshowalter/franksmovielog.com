import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildMultiSelectChips } from "~/components/filter-and-sort/facets/filterChipBuilders";

import { STATE_KEY } from "./creditedAsReducer";

export function buildCreditedAsFilterChips(
  values: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips({
    key: STATE_KEY,
    values: values,
  });
}
