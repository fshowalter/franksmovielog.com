import type { SortableTitle, TitleSort } from "~/sorters/createTitleSorter";

import { createSelectSortedTitles } from "~/selectors/createSelectSortedTitles";
import { sortNumber } from "~/sorters/createSorter";

/**
 * Available sort options for titles.
 * Includes sorting by release date and title in both directions.
 */
export type ReviewedTitleSort =
  | "grade-asc"
  | "grade-desc"
  | "review-date-asc"
  | "review-date-desc"
  | TitleSort;

/**
 * Interface for reviewed work items that can be sorted.
 * Contains all the fields necessary for sorting and grouping reviewed works.
 */
export type SortableReviewedTitle = SortableTitle & {
  gradeValue: number;
  reviewSequence: number;
};

export function createSelectSortedReviewedTitles<
  TValue extends SortableReviewedTitle,
  TSort extends string,
>(sortMap?: Record<string, (a: TValue, b: TValue) => number>) {
  const reviewedTitleSortMap = {
    ...sortGrade<TValue>(),
    ...sortReviewDate<TValue>(),
    ...sortMap,
  };

  return createSelectSortedTitles<TValue, TSort>(reviewedTitleSortMap);
}

/**
 * Creates title-based sort functions.
 *
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with title sort functions
 */
function sortGrade<TValue extends SortableReviewedTitle>() {
  return {
    "grade-asc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue, b.gradeValue),
    "grade-desc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue, b.gradeValue) * -1,
  };
}

/**
 * Creates release year-based sort functions.
 *
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with work year sort functions
 */
function sortReviewDate<TValue extends SortableReviewedTitle>() {
  return {
    "review-date-asc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewSequence, b.reviewSequence),
    "review-date-desc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewSequence, b.reviewSequence) * -1,
  };
}
