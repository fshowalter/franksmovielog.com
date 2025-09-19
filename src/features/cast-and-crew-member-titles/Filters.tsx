import { CreditedAsFilter } from "~/components/filter-and-sort/CreditedAsFilter";
import { MaybeReviewedTitleFilters } from "~/components/filter-and-sort/MaybeReviewedTitleFilters";

import type {
  CastAndCrewMemberTitlesAction,
  CastAndCrewMemberTitlesFiltersValues,
} from "./CastAndCrewMemberTitles.reducer";

import {
  createCreditedAsFilterChangedAction,
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
} from "./CastAndCrewMemberTitles.reducer";

/**
 * Filter controls for cast and crew member titles page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctCreditKinds - Available credit types for filtering
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.filterValues - Current active filter values
 * @returns Filter input components for cast and crew member titles
 */
export function Filters({
  dispatch,
  distinctCreditKinds,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
}: {
  dispatch: React.Dispatch<CastAndCrewMemberTitlesAction>;
  distinctCreditKinds: readonly string[];
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: CastAndCrewMemberTitlesFiltersValues;
}): React.JSX.Element {
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
          initialValue: filterValues.genres,

          onChange: (values) =>
            dispatch(createGenresFilterChangedAction(values)),
          values: distinctGenres,
        }}
        grade={{
          initialValue: filterValues.gradeValue,
          onChange: (values) =>
            dispatch(createGradeFilterChangedAction(values)),
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
    </>
  );
}
