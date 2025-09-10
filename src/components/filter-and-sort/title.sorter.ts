export { createSortValues } from "./sorter";

import { createSortValues, sortNumber, sortString } from "./sorter";

/**
 * Available sort options for titles.
 * Includes sorting by release date and title in both directions.
 */
export type TitleSort =
  | "release-date-asc"
  | "release-date-desc"
  | "title-asc"
  | "title-desc";

/**
 * Interface for reviewed work items that can be sorted.
 * Contains all the fields necessary for sorting and grouping reviewed works.
 */
type SortableTitle = {
  /** Numeric sequence for release year sorting */
  releaseSequence: number;
  /** Year the work was published */
  releaseYear: string;
  /** Normalized title for sorting (typically lowercase) */
  sortTitle: string;
};

export function createSortTitleValues<
  TValue extends SortableTitle,
  TSort extends string,
>(sortMap: Record<TSort, (a: TValue, b: TValue) => number> | undefined) {
  return createSortValues<TValue, TSort>({
    ...sortTitle<TValue>(),
    ...sortReleaseDate<TValue>(),
    ...sortMap,
  });
}

/**
 * Creates release year-based sort functions.
 *
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with work year sort functions
 */
function sortReleaseDate<TValue extends SortableTitle>() {
  return {
    "release-date-asc": (a: TValue, b: TValue) =>
      sortNumber(a.releaseSequence, b.releaseSequence),
    "release-date-desc": (a: TValue, b: TValue) =>
      sortNumber(a.releaseSequence, b.releaseSequence) * -1,
  };
}

/**
 * Creates title-based sort functions.
 *
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with title sort functions
 */
function sortTitle<TValue extends SortableTitle>() {
  return {
    "title-asc": (a: TValue, b: TValue) => sortString(a.sortTitle, b.sortTitle),
    "title-desc": (a: TValue, b: TValue) =>
      sortString(a.sortTitle, b.sortTitle) * -1,
  };
}
