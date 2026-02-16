import type { SortOption } from "./FilterAndSortContainer";

import { TITLE_SORT_OPTIONS } from "./TitleSortOptions";

/**
 * Sort options for reviewed title lists.
 */
export const REVIEWED_TITLE_SORT_OPTIONS: readonly SortOption[] = [
  ...TITLE_SORT_OPTIONS,
  { label: "Grade (Best First)", value: "grade-desc" },
  { label: "Grade (Worst First)", value: "grade-asc" },
  { label: "Review Date (Newest First)", value: "review-date-desc" },
  { label: "Review Date (Oldest First)", value: "review-date-asc" },
] as const;
