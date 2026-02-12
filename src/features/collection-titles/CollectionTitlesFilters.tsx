import { MaybeReviewedTitleFilters } from "~/components/filter-and-sort/MaybeReviewedTitleFilters";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type {
  CollectionTitlesAction,
  CollectionTitlesFiltersValues,
} from "./CollectionTitles.reducer";

import {
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createRemoveAppliedFilterAction,
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
} from "./CollectionTitles.reducer";
import {
  calculateGenreCounts,
  calculateReviewedStatusCounts,
} from "./filterCollectionTitles";

/**
 * Filter controls for the collection titles page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.filterValues - Current active filter values
 * @param props.values - All collection title values (for calculating counts)
 * @returns Filter input components for collection titles
 */
export function CollectionTitlesFilters({
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<CollectionTitlesAction>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: CollectionTitlesFiltersValues;
  values?: CollectionTitlesValue[];
}): React.JSX.Element {
  // Calculate genre counts dynamically (respects all non-genre filters)
  const genreCounts = values
    ? calculateGenreCounts(values, filterValues)
    : undefined;

  // Calculate reviewed status counts dynamically
  const reviewedStatusCounts = values
    ? calculateReviewedStatusCounts(values, filterValues)
    : undefined;

  return (
    <MaybeReviewedTitleFilters
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
      }}
      releaseYear={{
        defaultValues: filterValues.releaseYear,
        onChange: (values) =>
          dispatch(createReleaseYearFilterChangedAction(values)),
        values: distinctReleaseYears,
      }}
      reviewedStatus={{
        counts: reviewedStatusCounts,
        defaultValues: filterValues.reviewedStatus,
        onChange: (values) =>
          dispatch(createReviewedStatusFilterChangedAction(values)),
        onClear: () =>
          dispatch(createRemoveAppliedFilterAction("reviewedStatus")),
      }}
      reviewYear={{
        defaultValues: filterValues.reviewYear,
        onChange: (values) =>
          dispatch(createReviewYearFilterChangedAction(values)),
        values: distinctReviewYears,
      }}
      title={{
        defaultValue: filterValues.title,
        onChange: (value) => dispatch(createTitleFilterChangedAction(value)),
      }}
    />
  );
}
