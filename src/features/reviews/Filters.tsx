import { ReviewedTitleFilters } from "~/components/filter-and-sort/ReviewedTitleFilters";
import { ReviewedTitleSortOptions } from "~/components/filter-and-sort/ReviewedTitleSortOptions";

import type { ReviewsAction, ReviewsFiltersValues } from "./reducer";

import { createGenresFilterChangedAction, createGradeFilterChangedAction, createReleaseYearFilterChangedAction, createReviewYearFilterChangedAction, createTitleFilterChangedAction } from "./reducer";

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

export function SortOptions(): React.JSX.Element {
  return <ReviewedTitleSortOptions />;
}
