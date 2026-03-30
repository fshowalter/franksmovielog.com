import type { FilterAndSortContainerAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import type { GenresFilterChangedAction } from "~/components/filter-and-sort/facets/genres/genresReducer";
import type { GradeFilterChangedAction } from "~/components/filter-and-sort/facets/grade/gradeReducer";
import type { ReleaseYearFilterChangedAction } from "~/components/filter-and-sort/facets/release-year/releaseYearReducer";
import type { ReviewYearFilterChangedAction } from "~/components/filter-and-sort/facets/review-year/reviewYearReducer";
import type { TitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";
import type { ShowMoreAction } from "~/components/filter-and-sort/paginated-list/paginationReducer";
import type { GradeValue } from "~/utils/grades";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { composeReducers } from "~/components/filter-and-sort/facets/composeReducers";
import { genresFacetReducer } from "~/components/filter-and-sort/facets/genres/genresReducer";
import { gradeFacetReducer } from "~/components/filter-and-sort/facets/grade/gradeReducer";
import { releaseYearFacetReducer } from "~/components/filter-and-sort/facets/release-year/releaseYearReducer";
import { reviewYearFacetReducer } from "~/components/filter-and-sort/facets/review-year/reviewYearReducer";
import { titleFacetReducer } from "~/components/filter-and-sort/facets/title/titleReducer";
import {
  createInitialPaginationState,
  paginationReducer,
} from "~/components/filter-and-sort/paginated-list/paginationReducer";

import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./sortReviews";

export type ReviewsAction =
  | FilterAndSortContainerAction<ReviewsSort>
  | GenresFilterChangedAction
  | GradeFilterChangedAction
  | ReleaseYearFilterChangedAction
  | ReviewYearFilterChangedAction
  | ShowMoreAction
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
  filterAndSortContainerReducer,
  titleFacetReducer,
  genresFacetReducer,
  gradeFacetReducer,
  releaseYearFacetReducer,
  reviewYearFacetReducer,
  paginationReducer,
);

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: ReviewsSort;
  values: ReviewsValue[];
}): ReviewsState {
  return {
    ...createInitialFilterAndSortContainerState({ initialSort, values }),
    ...createInitialPaginationState(),
  };
}

export function reducer(
  state: ReviewsState,
  action: ReviewsAction,
): ReviewsState {
  return reviewsComposedReducer(state, action);
}
