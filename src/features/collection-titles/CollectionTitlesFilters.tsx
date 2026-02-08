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
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
} from "./CollectionTitles.reducer";
import { calculateGenreCounts } from "./filterCollectionTitles";

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

  return (
    <MaybeReviewedTitleFilters
      genres={{
        counts: genreCounts,
        defaultValues: filterValues.genres,
        onChange: (values) => dispatch(createGenresFilterChangedAction(values)),
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
        defaultValue: filterValues.reviewedStatus,
        onChange: (value) =>
          dispatch(createReviewedStatusFilterChangedAction(value)),
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
