import { CreditedAsFilter } from "~/components/filter-and-sort/CreditedAsFilter";
import { MaybeReviewedTitleFilters } from "~/components/filter-and-sort/MaybeReviewedTitleFilters";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type {
  CastAndCrewMemberTitlesAction,
  CastAndCrewMemberTitlesFiltersValues,
} from "./CastAndCrewMemberTitles.reducer";

import {
  createCreditedAsFilterChangedAction,
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createRemoveAppliedFilterAction,
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
} from "./CastAndCrewMemberTitles.reducer";
import { calculateGenreCounts } from "./filterCastAndCrewMemberTitles";

/**
 * Filter controls for cast and crew member titles page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctCreditKinds - Available credit types for filtering
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.filterValues - Current active filter values
 * @param props.values - All cast and crew member title values for count calculation
 * @returns Filter input components for cast and crew member titles
 */
export function CastAndCrewMemberTitlesFilters({
  dispatch,
  distinctCreditKinds,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<CastAndCrewMemberTitlesAction>;
  distinctCreditKinds: readonly string[];
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: CastAndCrewMemberTitlesFiltersValues;
  values: CastAndCrewMemberTitlesValue[];
}): React.JSX.Element {
  // Calculate genre counts based on current filters
  const genreCounts = calculateGenreCounts(values, filterValues);
  return (
    <>
      {distinctCreditKinds.length > 1 && (
        <CreditedAsFilter
          defaultValue={filterValues.creditedAs}
          onChange={(value) =>
            dispatch(createCreditedAsFilterChangedAction(value))
          }
          values={distinctCreditKinds}
        />
      )}
      <MaybeReviewedTitleFilters
        genres={{
          counts: genreCounts,
          defaultValues: filterValues.genres,
          onChange: (values) =>
            dispatch(createGenresFilterChangedAction(values)),
          onClear: () => dispatch(createRemoveAppliedFilterAction("genres")),
          values: distinctGenres,
        }}
        grade={{
          defaultValues: filterValues.gradeValue,
          onChange: (values) =>
            dispatch(createGradeFilterChangedAction(values)),
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
    </>
  );
}
