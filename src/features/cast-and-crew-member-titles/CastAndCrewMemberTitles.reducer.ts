import type { FiltersAction } from "~/reducers/filtersReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { composeReducers } from "~/facets/composeReducers";
import {
  creditedAsFacetReducer,
} from "~/facets/creditedAs/creditedAsReducer";
import { genresFacetReducer } from "~/facets/genres/genresReducer";
import { gradeFacetReducer } from "~/facets/grade/gradeReducer";
import { releaseYearFacetReducer } from "~/facets/releaseYear/releaseYearReducer";
import { reviewedStatusFacetReducer } from "~/facets/reviewedStatus/reviewedStatusReducer";
import { reviewYearFacetReducer } from "~/facets/reviewYear/reviewYearReducer";
import { titleFacetReducer } from "~/facets/title/titleReducer";
import {
  createInitialFiltersState,
  filtersReducer,
} from "~/reducers/filtersReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export {
  createCreditedAsFilterChangedAction,
} from "~/facets/creditedAs/creditedAsReducer";
export { createGenresFilterChangedAction } from "~/facets/genres/genresReducer";
export { createGradeFilterChangedAction } from "~/facets/grade/gradeReducer";
export {
  createReleaseYearFilterChangedAction,
} from "~/facets/releaseYear/releaseYearReducer";
export {
  createReviewedStatusFilterChangedAction,
} from "~/facets/reviewedStatus/reviewedStatusReducer";
export {
  createReviewYearFilterChangedAction,
} from "~/facets/reviewYear/reviewYearReducer";
export { createTitleFilterChangedAction } from "~/facets/title/titleReducer";
export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  selectHasPendingFilters,
} from "~/reducers/filtersReducer";

import type {
  CreditedAsFilterChangedAction,
} from "~/facets/creditedAs/creditedAsReducer";
import type { GenresFilterChangedAction } from "~/facets/genres/genresReducer";
import type { GradeFilterChangedAction } from "~/facets/grade/gradeReducer";
import type {
  ReleaseYearFilterChangedAction,
} from "~/facets/releaseYear/releaseYearReducer";
import type {
  ReviewedStatusFilterChangedAction,
} from "~/facets/reviewedStatus/reviewedStatusReducer";
import type {
  ReviewYearFilterChangedAction,
} from "~/facets/reviewYear/reviewYearReducer";
import type { TitleFilterChangedAction } from "~/facets/title/titleReducer";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

export type CastAndCrewMemberTitlesAction =
  | CreditedAsFilterChangedAction
  | FiltersAction
  | GenresFilterChangedAction
  | GradeFilterChangedAction
  | ReleaseYearFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | ReviewYearFilterChangedAction
  | SortAction<CastAndCrewMemberTitlesSort>
  | TitleFilterChangedAction;

export type CastAndCrewMemberTitlesFiltersValues = {
  creditedAs?: readonly string[];
  genres?: readonly string[];
  gradeValue?: [number, number];
  releaseYear?: [string, string];
  reviewedStatus?: readonly string[];
  reviewYear?: [string, string];
  title?: string;
};

type CastAndCrewMemberTitlesState = {
  activeFilterValues: CastAndCrewMemberTitlesFiltersValues;
  pendingFilterValues: CastAndCrewMemberTitlesFiltersValues;
  sort: CastAndCrewMemberTitlesSort;
  values: CastAndCrewMemberTitlesValue[];
};

const castAndCrewMemberTitlesComposedReducer =
  composeReducers<CastAndCrewMemberTitlesState>(
    filtersReducer,
    titleFacetReducer,
    genresFacetReducer,
    gradeFacetReducer,
    releaseYearFacetReducer,
    reviewYearFacetReducer,
    reviewedStatusFacetReducer,
    creditedAsFacetReducer,
    (state, action) =>
      action.type === "sort/sort"
        ? sortReducer(state, action as SortAction<CastAndCrewMemberTitlesSort>)
        : state,
  );

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CastAndCrewMemberTitlesSort;
  values: CastAndCrewMemberTitlesValue[];
}): CastAndCrewMemberTitlesState {
  return {
    ...createInitialFiltersState({ values }),
    ...createInitialSortState({ initialSort }),
  };
}

export function reducer(
  state: CastAndCrewMemberTitlesState,
  action: CastAndCrewMemberTitlesAction,
): CastAndCrewMemberTitlesState {
  return castAndCrewMemberTitlesComposedReducer(state, action);
}

export const createSortAction =
  createSortActionCreator<CastAndCrewMemberTitlesSort>();
