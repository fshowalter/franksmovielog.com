import type { FiltersAction } from "~/reducers/filtersReducer";
import type { ShowMoreAction } from "~/reducers/showMoreReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { composeReducers } from "~/facets/composeReducers";
import { genresFacetReducer } from "~/facets/genres/genresReducer";
import { gradeFacetReducer } from "~/facets/grade/gradeReducer";
import { releaseYearFacetReducer } from "~/facets/releaseYear/releaseYearReducer";
import { reviewYearFacetReducer } from "~/facets/reviewYear/reviewYearReducer";
import { titleFacetReducer } from "~/facets/title/titleReducer";
import {
  createInitialFiltersState,
  filtersReducer,
} from "~/reducers/filtersReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/reducers/showMoreReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export { createGenresFilterChangedAction } from "~/facets/genres/genresReducer";
export { createGradeFilterChangedAction } from "~/facets/grade/gradeReducer";
export { createReleaseYearFilterChangedAction } from "~/facets/releaseYear/releaseYearReducer";
export { createReviewYearFilterChangedAction } from "~/facets/reviewYear/reviewYearReducer";
export { createTitleFilterChangedAction } from "~/facets/title/titleReducer";
export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  selectHasPendingFilters,
} from "~/reducers/filtersReducer";
export { createShowMoreAction } from "~/reducers/showMoreReducer";

import type { GenresFilterChangedAction } from "~/facets/genres/genresReducer";
import type { GradeFilterChangedAction } from "~/facets/grade/gradeReducer";
import type { ReleaseYearFilterChangedAction } from "~/facets/releaseYear/releaseYearReducer";
import type { ReviewYearFilterChangedAction } from "~/facets/reviewYear/reviewYearReducer";
import type { TitleFilterChangedAction } from "~/facets/title/titleReducer";

import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./sortReviews";

export type ReviewsAction =
  | FiltersAction
  | GenresFilterChangedAction
  | GradeFilterChangedAction
  | ReleaseYearFilterChangedAction
  | ReviewYearFilterChangedAction
  | ShowMoreAction
  | SortAction<ReviewsSort>
  | TitleFilterChangedAction;

export type ReviewsFiltersValues = {
  genres?: readonly string[];
  gradeValue?: [number, number];
  releaseYear?: [string, string];
  reviewYear?: [string, string];
  title?: string;
};

type ReviewsState = {
  activeFilterValues: ReviewsFiltersValues;
  pendingFilterValues: ReviewsFiltersValues;
  showCount: number;
  sort: ReviewsSort;
  values: ReviewsValue[];
};

const reviewsComposedReducer = composeReducers<ReviewsState>(
  filtersReducer,
  titleFacetReducer,
  genresFacetReducer,
  gradeFacetReducer,
  releaseYearFacetReducer,
  reviewYearFacetReducer,
  (state, action) =>
    action.type === "sort/sort"
      ? sortReducer(state, action as SortAction<ReviewsSort>)
      : state,
  (state, action) =>
    action.type === "showMore/showMore"
      ? showMoreReducer(state, action as ShowMoreAction)
      : state,
);

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: ReviewsSort;
  values: ReviewsValue[];
}): ReviewsState {
  return {
    ...createInitialFiltersState({ values }),
    ...createInitialShowMoreState(),
    ...createInitialSortState({ initialSort }),
  };
}

export function reducer(
  state: ReviewsState,
  action: ReviewsAction,
): ReviewsState {
  return reviewsComposedReducer(state, action);
}

export const createSortAction = createSortActionCreator<ReviewsSort>();
