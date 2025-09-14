import type {
  FilterableMaybeReviewedTitle,
  MaybeReviewedTitleFiltersValues,
} from "~/reducers/maybeReviewedTitleFiltersReducer";

import { filterTitles } from "./filterTitles";

export function filterMaybeReviewedTitles<
  TValue extends FilterableMaybeReviewedTitle,
>(
  filterValues: MaybeReviewedTitleFiltersValues,
  sortedValues: TValue[],
  extraFilters: ((value: TValue) => boolean)[],
) {
  const filters: ((value: TValue) => boolean)[] = [
    createGradeFilter(filterValues.gradeValue),
    createReviewYearFilter(filterValues.reviewYear),
    ...extraFilters,
  ].filter((filterFn) => filterFn !== undefined);

  return filterTitles(filterValues, sortedValues, filters);
}

/**
 * Create a Genre filter function
 */
function createGradeFilter<TValue extends FilterableMaybeReviewedTitle>(
  filterValue?: [number, number],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.gradeValue >= filterValue[0] && value.gradeValue <= filterValue[1]
    );
  };
}

function createReviewYearFilter<TValue extends FilterableMaybeReviewedTitle>(
  filterValue?: [string, string],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.reviewYear >= filterValue[0] && value.reviewYear <= filterValue[1]
    );
  };
}
