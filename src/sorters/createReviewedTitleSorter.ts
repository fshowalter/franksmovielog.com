import { sortNumber } from "./createSorter";
import {
  createTitleSorter,
  type SortableTitle,
  type TitleSort,
} from "./createTitleSorter";

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

export type SortableReviewedTitle = SortableTitle & {
  grade: string;
  gradeValue: number;
  reviewMonth?: string;
  reviewSequence: number;
  reviewYear: string;
};

export function createReviewedTitleSorter<
  TValue extends SortableReviewedTitle,
  TSort extends string,
>(sortMap?: Record<string, (a: TValue, b: TValue) => number>) {
  const sorter = createTitleSorter<TValue, TSort>({
    ...sortGrade<TValue>(),
    ...sortReviewDate<TValue>(),
    ...sortMap,
  });

  return function reviewedTitleSorter(values: TValue[], sort: TSort) {
    return sorter(values, sort);
  };
}

function sortGrade<TValue extends SortableReviewedTitle>() {
  return {
    "title-asc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue, b.gradeValue),
    "title-desc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue, b.gradeValue) * -1,
  };
}

function sortReviewDate<TValue extends SortableReviewedTitle>() {
  return {
    "review-date-asc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewSequence, b.reviewSequence),
    "review-date-desc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewSequence, b.reviewSequence) * -1,
  };
}
