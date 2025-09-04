import type { TitleFilterValues } from "~/components/ListWithFilters/titlesReducerUtils";

import { TitleFilters } from "~/components/ListWithFilters/TitleFilters";
import { TitleSortOptions } from "~/components/ListWithFilters/TitleSortOptions";

import type { ActionType } from "./reducer";

import { Actions } from "./reducer";

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
  );
}

export function SortOptions(): React.JSX.Element {
  return (
    <TitleSortOptions
      options={["title", "grade", "release-date", "review-date"]}
    />
  );
}
