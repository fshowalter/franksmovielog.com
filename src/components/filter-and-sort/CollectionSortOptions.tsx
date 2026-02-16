import type { SortOption } from "./FilterAndSortContainer";

/**
 * Sort options for collections.
 */
export const COLLECTION_SORT_OPTIONS: readonly SortOption[] = [
  { label: "Name (A → Z)", value: "name-asc" },
  { label: "Name (Z → A)", value: "name-desc" },
  { label: "Review Count (Most First)", value: "review-count-desc" },
  { label: "Review Count (Fewest First)", value: "review-count-asc" },
] as const;
