import type { MaybeReviewedTitleFiltersValues } from "~/reducers/maybeReviewedTitleFiltersReducer";

type FilterableMaybeReviewedTitle = FilterableTitle & {
  gradeValue?: number;
  reviewYear?: string;
  slug?: string;
};

import type { FilterableTitle } from "./filterTitles";

import { createReviewedStatusFilter } from "./createReviewedStatusFilter";
import { filterTitles } from "./filterTitles";

/**
 * Filters titles that may or may not be reviewed based on various criteria.
 * @param filterValues - Current filter configuration
 * @param sortedValues - Array of sorted titles to filter
 * @param extraFilters - Additional custom filter functions
 * @returns Filtered array of titles
 */
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
    createReviewedStatusFilter(filterValues.reviewedStatus),
    ...extraFilters,
  ].filter((filterFn) => filterFn !== undefined);

  return filterTitles(filterValues, sortedValues, filters);
}

function createGradeFilter<TValue extends FilterableMaybeReviewedTitle>(
  filterValue?: [number, number],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    if (!value.gradeValue) {
      return false;
    }

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
    if (!value.reviewYear) {
      return false;
    }

    return (
      value.reviewYear >= filterValue[0] && value.reviewYear <= filterValue[1]
    );
  };
}
