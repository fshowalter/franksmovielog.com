import type { FilterAndSortContainerAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import type { GenresFilterChangedAction } from "~/components/filter-and-sort/facets/genres/genresReducer";
import type { GradeFilterChangedAction } from "~/components/filter-and-sort/facets/grade/gradeReducer";
import type { ReleaseYearFilterChangedAction } from "~/components/filter-and-sort/facets/release-year/releaseYearReducer";
import type { ReviewYearFilterChangedAction } from "~/components/filter-and-sort/facets/review-year/reviewYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
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
import { reviewedStatusFacetReducer } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import { titleFacetReducer } from "~/components/filter-and-sort/facets/title/titleReducer";
import {
  createInitialPaginationState,
  paginationReducer,
} from "~/components/filter-and-sort/paginated-list/paginationReducer";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesSort } from "./sortCollectionTitles";

export type CollectionTitlesAction =
  | FilterAndSortContainerAction<CollectionTitlesSort>
  | GenresFilterChangedAction
  | GradeFilterChangedAction
  | ReleaseYearFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | ReviewYearFilterChangedAction
  | ShowMoreAction
  | TitleFilterChangedAction;

export type CollectionTitlesFiltersValues = {
  genres?: readonly string[];
  gradeValue?: [GradeValue, GradeValue];
  releaseYear?: [string, string];
  reviewedStatus?: readonly string[];
  reviewYear?: [string, string];
  title?: string;
};

type CollectionTitlesState = {
  activeFilterValues: CollectionTitlesFiltersValues;
  pendingFilterValues: CollectionTitlesFiltersValues;
  showCount: number;
  sort: CollectionTitlesSort;
  values: CollectionTitlesValue[];
};

const collectionTitlesComposedReducer = composeReducers<CollectionTitlesState>(
  filterAndSortContainerReducer,
  titleFacetReducer,
  genresFacetReducer,
  gradeFacetReducer,
  releaseYearFacetReducer,
  paginationReducer,
  reviewYearFacetReducer,
  reviewedStatusFacetReducer,
);

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CollectionTitlesSort;
  values: CollectionTitlesValue[];
}): CollectionTitlesState {
  return {
    ...createInitialFilterAndSortContainerState({ initialSort, values }),
    ...createInitialPaginationState(),
  };
}

export function reducer(
  state: CollectionTitlesState,
  action: CollectionTitlesAction,
): CollectionTitlesState {
  return collectionTitlesComposedReducer(state, action);
}
