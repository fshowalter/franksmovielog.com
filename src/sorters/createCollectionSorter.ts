import { createSorter, sortNumber, sortString } from "./createSorter";

/**
 * Available sort options for titles.
 * Includes sorting by release date and title in both directions.
 */
export type CollectionSort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

/**
 * Interface for reviewed work items that can be sorted.
 * Contains all the fields necessary for sorting and grouping reviewed works.
 */
export type SortableCollection = {
  /** Year the work was published */
  name: string;
  /** Numeric sequence for release year sorting */
  reviewCount: number;
};

export function createCollectionSorter<
  TValue extends SortableCollection,
  TSort extends string,
>(sortMap?: Record<string, (a: TValue, b: TValue) => number>) {
  const sorter = createSorter<TValue, TSort>({
    ...sortName<TValue>(),
    ...sortReviewCount<TValue>(),
    ...sortMap,
  });

  return function collectionSorter(values: TValue[], sort: TSort) {
    return sorter(values, sort);
  };
}

function sortName<TValue extends SortableCollection>() {
  return {
    "name-asc": (a: TValue, b: TValue) => sortString(a.name, b.name),
    "name-desc": (a: TValue, b: TValue) => sortString(a.name, b.name) * -1,
  };
}

/**
 * Creates release year-based sort functions.
 *
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with work year sort functions
 */
function sortReviewCount<TValue extends SortableCollection>() {
  return {
    "review-count-asc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewCount, b.reviewCount),
    "review-count-desc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewCount, b.reviewCount) * -1,
  };
}
