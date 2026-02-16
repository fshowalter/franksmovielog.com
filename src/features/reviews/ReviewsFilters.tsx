import { ReviewedTitleFilters } from "~/components/filter-and-sort/ReviewedTitleFilters";

import type { ReviewsAction, ReviewsFiltersValues } from "./reducer";
import type { ReviewsValue } from "./ReviewsListItem";

import { calculateGenreCounts } from "./filteredReviews";
import {
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createRemoveAppliedFilterAction,
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
 * @param props.values - All review values for calculating counts
 * @returns Filter input components for reviews
 */
export function ReviewsFilters({
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<ReviewsAction>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: ReviewsFiltersValues;
  values: ReviewsValue[];
}): React.JSX.Element {
  // Calculate dynamic counts for genre filter options
  const genreCounts = calculateGenreCounts(values, filterValues);

  return (
    <ReviewedTitleFilters
      genres={{
        counts: genreCounts,
        defaultValues: filterValues.genres,
        onChange: (values) => dispatch(createGenresFilterChangedAction(values)),
        onClear: () => dispatch(createRemoveAppliedFilterAction("genres")),
        values: distinctGenres,
      }}
      grade={{
        defaultValues: filterValues.gradeValue,
        onChange: (values) => dispatch(createGradeFilterChangedAction(values)),
        onClear: () => dispatch(createRemoveAppliedFilterAction("gradeValue")),
      }}
      releaseYear={{
        defaultValues: filterValues.releaseYear,
        onChange: (values) =>
          dispatch(createReleaseYearFilterChangedAction(values)),
        onClear: () => dispatch(createRemoveAppliedFilterAction("releaseYear")),
        values: distinctReleaseYears,
      }}
      reviewYear={{
        defaultValues: filterValues.reviewYear,
        onChange: (values) =>
          dispatch(createReviewYearFilterChangedAction(values)),
        onClear: () => dispatch(createRemoveAppliedFilterAction("reviewYear")),
        values: distinctReviewYears,
      }}
      title={{
        defaultValue: filterValues.title,
        onChange: (value) => dispatch(createTitleFilterChangedAction(value)),
      }}
    />
  );
}

/**
 * Sort options for the reviews page.
 */

export { REVIEWED_TITLE_SORT_OPTIONS as SORT_OPTIONS } from "~/components/filter-and-sort/ReviewedTitleSortOptions";
