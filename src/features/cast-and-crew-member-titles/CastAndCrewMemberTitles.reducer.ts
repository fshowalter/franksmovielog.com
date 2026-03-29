import { composeReducers } from "~/components/filter-and-sort/facets/composeReducers";
import { creditedAsFacetReducer } from "~/components/filter-and-sort/facets/credited-as/creditedAsReducer";
import { genresFacetReducer } from "~/components/filter-and-sort/facets/genres/genresReducer";
import { gradeFacetReducer } from "~/components/filter-and-sort/facets/grade/gradeReducer";
import { releaseYearFacetReducer } from "~/components/filter-and-sort/facets/release-year/releaseYearReducer";
import { reviewYearFacetReducer } from "~/components/filter-and-sort/facets/review-year/reviewYearReducer";
import { reviewedStatusFacetReducer } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import { titleFacetReducer } from "~/components/filter-and-sort/facets/title/titleReducer";

export { createCreditedAsFilterChangedAction } from "~/components/filter-and-sort/facets/credited-as/creditedAsReducer";
export { createGenresFilterChangedAction } from "~/components/filter-and-sort/facets/genres/genresReducer";
export { createGradeFilterChangedAction } from "~/components/filter-and-sort/facets/grade/gradeReducer";
export { createReleaseYearFilterChangedAction } from "~/components/filter-and-sort/facets/release-year/releaseYearReducer";
export { createReviewYearFilterChangedAction } from "~/components/filter-and-sort/facets/review-year/reviewYearReducer";
export { createReviewedStatusFilterChangedAction } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
export { createTitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";
export { createRemoveAppliedFilterAction } from "~/reducers/filtersReducer";

import type { FilterAndSortContainerAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import type { CreditedAsFilterChangedAction } from "~/components/filter-and-sort/facets/credited-as/creditedAsReducer";
import type { GenresFilterChangedAction } from "~/components/filter-and-sort/facets/genres/genresReducer";
import type { GradeFilterChangedAction } from "~/components/filter-and-sort/facets/grade/gradeReducer";
import type { ReleaseYearFilterChangedAction } from "~/components/filter-and-sort/facets/release-year/releaseYearReducer";
import type { ReviewYearFilterChangedAction } from "~/components/filter-and-sort/facets/review-year/reviewYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import type { TitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";
import type { GradeValue } from "~/utils/grades";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/filter-and-sort/container/filterAndSortContainerReducer";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

export type CastAndCrewMemberTitlesAction =
  | CreditedAsFilterChangedAction
  | FilterAndSortContainerAction<CastAndCrewMemberTitlesSort>
  | GenresFilterChangedAction
  | GradeFilterChangedAction
  | ReleaseYearFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | ReviewYearFilterChangedAction
  | TitleFilterChangedAction;

export type CastAndCrewMemberTitlesFiltersValues = {
  creditedAs?: readonly string[];
  genres?: readonly string[];
  gradeValue?: [GradeValue, GradeValue];
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
    filterAndSortContainerReducer,
    titleFacetReducer,
    genresFacetReducer,
    gradeFacetReducer,
    releaseYearFacetReducer,
    reviewYearFacetReducer,
    reviewedStatusFacetReducer,
    creditedAsFacetReducer,
  );

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CastAndCrewMemberTitlesSort;
  values: CastAndCrewMemberTitlesValue[];
}): CastAndCrewMemberTitlesState {
  return {
    ...createInitialFilterAndSortContainerState({ initialSort, values }),
  };
}

export function reducer(
  state: CastAndCrewMemberTitlesState,
  action: CastAndCrewMemberTitlesAction,
): CastAndCrewMemberTitlesState {
  return castAndCrewMemberTitlesComposedReducer(state, action);
}
