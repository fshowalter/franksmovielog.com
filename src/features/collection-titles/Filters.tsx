import { MaybeReviewedTitleFilters } from "~/components/filter-and-sort/MaybeReviewedTitleFilters";

import type {
  CollectionTitlesAction,
  CollectionTitlesFiltersValues,
} from "./CollectionTitles.reducer";

import {
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
} from "./CollectionTitles.reducer";

export function Filters({
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
}: {
  dispatch: React.Dispatch<CollectionTitlesAction>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: CollectionTitlesFiltersValues;
}): React.JSX.Element {
  return (
    <MaybeReviewedTitleFilters
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
      reviewedStatus={{
        initialValue: filterValues.reviewedStatus,
        onChange: (value) =>
          dispatch(createReviewedStatusFilterChangedAction(value)),
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
