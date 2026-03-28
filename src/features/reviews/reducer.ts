import type { FiltersAction } from "~/reducers/filtersReducer";
import type { ShowMoreAction } from "~/reducers/showMoreReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { composeReducers } from "~/components/filter-and-sort/facets/composeReducers";
import { genresFacetReducer } from "~/components/filter-and-sort/facets/genres/genreReducer";
import { gradeFacetReducer } from "~/components/filter-and-sort/facets/grade/gradeReducer";
import { releaseYearFacetReducer } from "~/components/filter-and-sort/facets/releaseYear/releaseYearReducer";
import { reviewYearFacetReducer } from "~/components/filter-and-sort/facets/reviewYear/reviewYearReducer";
import { titleFacetReducer } from "~/components/filter-and-sort/facets/title/titleReducer";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
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

export { createGenresFilterChangedAction } from "~/components/filter-and-sort/facets/genres/genreReducer";
export { createGradeFilterChangedAction } from "~/components/filter-and-sort/facets/grade/gradeReducer";
export { createReleaseYearFilterChangedAction } from "~/components/filter-and-sort/facets/releaseYear/releaseYearReducer";
export { createReviewYearFilterChangedAction } from "~/components/filter-and-sort/facets/reviewYear/reviewYearReducer";
export { createTitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";
export { createRemoveAppliedFilterAction } from "~/reducers/filtersReducer";
export { createShowMoreAction } from "~/reducers/showMoreReducer";

import type { GenresFilterChangedAction } from "~/components/filter-and-sort/facets/genres/genreReducer";
import type { GradeFilterChangedAction } from "~/components/filter-and-sort/facets/grade/gradeReducer";
import type { ReleaseYearFilterChangedAction } from "~/components/filter-and-sort/facets/releaseYear/releaseYearReducer";
import type { ReviewYearFilterChangedAction } from "~/components/filter-and-sort/facets/reviewYear/reviewYearReducer";
import type { TitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";
import type { GradeValue } from "~/utils/grades";

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
  gradeValue?: [GradeValue, GradeValue];
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
  filtersLifecycleReducer,
  titleFacetReducer,
  genresFacetReducer,
  gradeFacetReducer,
  releaseYearFacetReducer,
  reviewYearFacetReducer,
  sortReducer,
  showMoreReducer,
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
