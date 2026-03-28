import type { FiltersAction } from "~/reducers/filtersReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { composeReducers } from "~/facets/composeReducers";
import { genresFacetReducer } from "~/facets/genres/genresReducer";
import { gradeFacetReducer } from "~/facets/grade/gradeReducer";
import { releaseYearFacetReducer } from "~/facets/releaseYear/releaseYearReducer";
import { reviewedStatusFacetReducer } from "~/facets/reviewedStatus/reviewedStatusReducer";
import { reviewYearFacetReducer } from "~/facets/reviewYear/reviewYearReducer";
import { titleFacetReducer } from "~/facets/title/titleReducer";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
} from "~/reducers/filtersReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export { createGenresFilterChangedAction } from "~/facets/genres/genresReducer";
export { createGradeFilterChangedAction } from "~/facets/grade/gradeReducer";
export { createReleaseYearFilterChangedAction } from "~/facets/releaseYear/releaseYearReducer";
export { createReviewedStatusFilterChangedAction } from "~/facets/reviewedStatus/reviewedStatusReducer";
export { createReviewYearFilterChangedAction } from "~/facets/reviewYear/reviewYearReducer";
export { createTitleFilterChangedAction } from "~/facets/title/titleReducer";
export { createRemoveAppliedFilterAction } from "~/reducers/filtersReducer";

import type { GenresFilterChangedAction } from "~/facets/genres/genresReducer";
import type { GradeFilterChangedAction } from "~/facets/grade/gradeReducer";
import type { ReleaseYearFilterChangedAction } from "~/facets/releaseYear/releaseYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/facets/reviewedStatus/reviewedStatusReducer";
import type { ReviewYearFilterChangedAction } from "~/facets/reviewYear/reviewYearReducer";
import type { TitleFilterChangedAction } from "~/facets/title/titleReducer";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesSort } from "./sortCollectionTitles";

export type CollectionTitlesAction =
  | FiltersAction
  | GenresFilterChangedAction
  | GradeFilterChangedAction
  | ReleaseYearFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | ReviewYearFilterChangedAction
  | SortAction<CollectionTitlesSort>
  | TitleFilterChangedAction;

export type CollectionTitlesFiltersValues = {
  genres?: readonly string[];
  gradeValue?: [number, number];
  releaseYear?: [string, string];
  reviewedStatus?: readonly string[];
  reviewYear?: [string, string];
  title?: string;
};

type CollectionTitlesState = {
  activeFilterValues: CollectionTitlesFiltersValues;
  pendingFilterValues: CollectionTitlesFiltersValues;
  sort: CollectionTitlesSort;
  values: CollectionTitlesValue[];
};

const collectionTitlesComposedReducer = composeReducers<CollectionTitlesState>(
  filtersLifecycleReducer,
  titleFacetReducer,
  genresFacetReducer,
  gradeFacetReducer,
  releaseYearFacetReducer,
  reviewYearFacetReducer,
  reviewedStatusFacetReducer,
  sortReducer,
);

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CollectionTitlesSort;
  values: CollectionTitlesValue[];
}): CollectionTitlesState {
  return {
    ...createInitialFiltersState({ values }),
    ...createInitialSortState({ initialSort }),
  };
}

export function reducer(
  state: CollectionTitlesState,
  action: CollectionTitlesAction,
): CollectionTitlesState {
  return collectionTitlesComposedReducer(state, action);
}

export const createSortAction = createSortActionCreator<CollectionTitlesSort>();
