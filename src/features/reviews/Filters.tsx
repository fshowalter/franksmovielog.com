import { ReviewedTitleFilters } from "~/components/filter-and-sort/ReviewedTitleFilters";
import { ReviewedTitleSortOptions } from "~/components/filter-and-sort/ReviewedTitleSortOptions";

import type { ReviewsAction, ReviewsFiltersValues } from "./reducer";

import {
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
} from "./reducer";

/**
 * Filter controls for the reviews page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.filterValues - Current active filter values
 * @returns Filter input components for reviews
 */
export function Filters({
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ReviewsAction>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: ReviewsFiltersValues;
}): React.JSX.Element {
  return (
    <ReviewedTitleFilters
      genres={{
        initialValue: filterValues.genres,
        onChange: (values) => dispatch(createGenresFilterChangedAction(values)),
        values: distinctGenres,
      }}
      grade={{
        initialValue: filterValues.gradeValue,
        onChange: (values) => dispatch(createGradeFilterChangedAction(values)),
      }}
      releaseYear={{
        initialValue: filterValues.releaseYear,
        onChange: (values) =>
          dispatch(createReleaseYearFilterChangedAction(values)),
        values: distinctReleaseYears,
      }}
      reviewYear={{
        initialValue: filterValues.reviewYear,
        onChange: (values) =>
          dispatch(createReviewYearFilterChangedAction(values)),
        values: distinctReviewYears,
      }}
      title={{
        initialValue: filterValues.title,
        onChange: (value) => dispatch(createTitleFilterChangedAction(value)),
      }}
    />
  );
}

/**
 * Sort options component for the reviews page.
 * @returns Reviewed title sort options component
 */
export function SortOptions(): React.JSX.Element {
  return <ReviewedTitleSortOptions />;
}
