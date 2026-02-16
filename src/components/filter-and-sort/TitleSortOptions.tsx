import type { SortOption } from "./FilterAndSortContainer";

/**
 * Sort options for title lists.
 */
export const TITLE_SORT_OPTIONS: readonly SortOption[] = [
  { label: "Title (A → Z)", value: "title-asc" },
  { label: "Title (Z → A)", value: "title-desc" },
  { label: "Release Date (Newest First)", value: "release-date-desc" },
  { label: "Release Date (Oldest First)", value: "release-date-asc" },
] as const;
