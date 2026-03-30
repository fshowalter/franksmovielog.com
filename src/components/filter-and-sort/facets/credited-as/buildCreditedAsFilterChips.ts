import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { capitalize } from "~/utils/capitalize";

import { STATE_KEY } from "./creditedAsReducer";

export function buildCreditedAsFilterChips(
  values: readonly string[] | undefined,
): FilterChip[] {
  if (!values || values.length === 0) return [];

  return values.map((value) => ({
    displayText: capitalize(value),
    key: STATE_KEY,
    value,
  }));
}
