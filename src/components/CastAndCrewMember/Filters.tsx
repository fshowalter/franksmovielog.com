import { CreditedAsFilter } from "~/components/ListWithFilters/CreditedAsFilter";
import { TitleFilters } from "~/components/ListWithFilters/TitleFilters";

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
}): React.JSX.Element {
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
              type: Actions.PENDING_FILTER_REVIEWED_STATUS,
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
