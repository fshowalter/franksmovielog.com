import type { TitleFilterValues } from "~/components/ListWithFilters/titlesReducerUtils";

import { TitleFilters } from "~/components/TitleFilters";

import type { ActionType } from "./Collection.reducer";

import { Actions } from "./Collection.reducer";

export function Filters({
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: TitleFilterValues;
}): React.JSX.Element {
  return (
    <>
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
            dispatch({ type: Actions.PENDING_FILTER_GRADE, values }),
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
