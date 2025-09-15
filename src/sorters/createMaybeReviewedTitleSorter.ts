import type { ReviewedTitleSort } from "./createReviewedTitleSorter";
import type { SortableTitle } from "./createTitleSorter";

import { sortNumber } from "./createSorter";
import { createTitleSorter } from "./createTitleSorter";

/**
 * Available sort options for titles.
 * Includes sorting by release date and title in both directions.
 */
export type MaybeReviewedTitleSort = ReviewedTitleSort;

export type SortableMaybeReviewedTitle = SortableTitle & {
  gradeValue?: number;
  reviewSequence?: number;
};

export function createMaybeReviewedTitleSorter<
  TValue extends SortableMaybeReviewedTitle,
  TSort extends string,
>(sortMap?: Record<string, (a: TValue, b: TValue) => number>) {
  const sorter = createTitleSorter<TValue, TSort>({
    ...sortGrade<TValue>(),
    ...sortReviewDate<TValue>(),
    ...sortMap,
  });

  return function maybeReviewedTitleSorter(values: TValue[], sort: TSort) {
    return sorter(values, sort);
  };
}

function sortGrade<TValue extends SortableMaybeReviewedTitle>() {
  return {
    "grade-asc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue || 20, b.gradeValue || 20),
    "grade-desc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue || 0, b.gradeValue || 0) * -1,
  };
}

function sortReviewDate<TValue extends SortableMaybeReviewedTitle>() {
  return {
    "review-date-asc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewSequence || Infinity, b.reviewSequence || Infinity),
    "review-date-desc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewSequence || 0, b.reviewSequence || 0) * -1,
  };
}
