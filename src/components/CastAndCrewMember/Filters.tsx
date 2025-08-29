import type { JSX } from "react";

import { CreditedAsFilter } from "~/components/CreditedAsFilter";
import { TitleFilters } from "~/components/TitleFilters";

import type {
  ActionType,
  CastAndCrewMemberFilterValues,
} from "./CastAndCrewMember.reducer";

import { Actions } from "./CastAndCrewMember.reducer";

export function Filters({
  creditedAs,
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
}: {
  creditedAs: readonly string[];
  dispatch: React.Dispatch<ActionType>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: CastAndCrewMemberFilterValues;
}): JSX.Element {
  return (
    <>
      {creditedAs.length > 1 && (
        <CreditedAsFilter
          initialValue={filterValues.creditedAs}
          onChange={(value) =>
            dispatch({
              type: Actions.PENDING_FILTER_CREDITED_AS,
              value,
            })
          }
          values={creditedAs}
        />
      )}
      <TitleFilters
        genre={{
          initialValue: filterValues.genre,

          onChange: (values) =>
            dispatch({
              type: Actions.PENDING_FILTER_GENRES,
              values,
            }),
          values: distinctGenres,
        }}
        grade={{
          initialValue: filterValues.grade,
          onChange: (values) =>
            dispatch({
              type: Actions.PENDING_FILTER_GRADE,
              values,
            }),
        }}
        releaseYear={{
          initialValue: filterValues.releaseYear,
          onChange: (values) =>
            dispatch({ type: Actions.PENDING_FILTER_RELEASE_YEAR, values }),
          values: distinctReleaseYears,
        }}
        reviewedStatus={{
          initialValue: filterValues.reviewedStatus,
          onChange: (value) =>
            dispatch({
              type: Actions.PENDING_FILTER_REVIEW_STATUS,
              value,
            }),
        }}
        reviewYear={{
          initialValue: filterValues.reviewYear,
          onChange: (values) =>
            dispatch({ type: Actions.PENDING_FILTER_REVIEW_YEAR, values }),
          values: distinctReviewYears,
        }}
        title={{
          initialValue: filterValues.title,
          onChange: (value) =>
            dispatch({ type: Actions.PENDING_FILTER_TITLE, value }),
        }}
      />
    </>
  );
}

export function SortOptions() {
  return (
    <>
      <option value="release-date-desc">Release Date (Newest First)</option>
      <option value="release-date-asc">Release Date (Oldest First)</option>
      <option value="title-asc">Title (A &rarr; Z)</option>
      <option value="title-desc">Title (Z &rarr; A)</option>
      <option value="grade-desc">Grade (Best First)</option>
      <option value="grade-asc">Grade (Worst First)</option>
      <option value="review-date-desc">Review Date (Newest First)</option>
      <option value="review-date-asc">Review Date (Oldest First)</option>
    </>
  );
}
