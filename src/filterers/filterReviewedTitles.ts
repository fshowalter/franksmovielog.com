import type { ReviewedTitleFiltersValues } from "~/reducers/reviewedTitleFiltersReducer";

import type { FilterableTitle } from "./filterTitles";

import { filterTitles } from "./filterTitles";

export type FilterableReviewedTitle = FilterableTitle & {
  gradeValue: number;
  reviewYear: string;
};

export function filterReviewedTitles<TValue extends FilterableReviewedTitle>(
  filterValues: ReviewedTitleFiltersValues,
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
function createGradeFilter<TValue extends FilterableReviewedTitle>(
  filterValue?: [number, number],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.gradeValue >= filterValue[0] && value.gradeValue <= filterValue[1]
    );
  };
}

function createReviewYearFilter<TValue extends FilterableReviewedTitle>(
  filterValue?: [string, string],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.reviewYear >= filterValue[0] && value.reviewYear <= filterValue[1]
    );
  };
}
