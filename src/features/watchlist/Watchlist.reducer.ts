import type { FiltersAction } from "~/reducers/filtersReducer";
import type { ShowMoreAction } from "~/reducers/showMoreReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { collectionFacetReducer } from "~/facets/collection/collectionReducer";
import { composeReducers } from "~/facets/composeReducers";
import { directorFacetReducer } from "~/facets/director/directorReducer";
import { genresFacetReducer } from "~/facets/genres/genresReducer";
import { performerFacetReducer } from "~/facets/performer/performerReducer";
import { releaseYearFacetReducer } from "~/facets/releaseYear/releaseYearReducer";
import { titleFacetReducer } from "~/facets/title/titleReducer";
import { writerFacetReducer } from "~/facets/writer/writerReducer";
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

export { createCollectionFilterChangedAction } from "~/facets/collection/collectionReducer";
export { createDirectorFilterChangedAction } from "~/facets/director/directorReducer";
export { createGenresFilterChangedAction } from "~/facets/genres/genresReducer";
export { createPerformerFilterChangedAction } from "~/facets/performer/performerReducer";
export { createReleaseYearFilterChangedAction } from "~/facets/releaseYear/releaseYearReducer";
export { createTitleFilterChangedAction } from "~/facets/title/titleReducer";
export { createWriterFilterChangedAction } from "~/facets/writer/writerReducer";
export { createRemoveAppliedFilterAction } from "~/reducers/filtersReducer";
export { createShowMoreAction } from "~/reducers/showMoreReducer";

import type { CollectionFilterChangedAction } from "~/facets/collection/collectionReducer";
import type { DirectorFilterChangedAction } from "~/facets/director/directorReducer";
import type { GenresFilterChangedAction } from "~/facets/genres/genresReducer";
import type { PerformerFilterChangedAction } from "~/facets/performer/performerReducer";
import type { ReleaseYearFilterChangedAction } from "~/facets/releaseYear/releaseYearReducer";
import type { TitleFilterChangedAction } from "~/facets/title/titleReducer";
import type { WriterFilterChangedAction } from "~/facets/writer/writerReducer";

import type { WatchlistSort } from "./sortWatchlistValues";
import type { WatchlistValue } from "./Watchlist";

export type WatchlistAction =
  | CollectionFilterChangedAction
  | DirectorFilterChangedAction
  | FiltersAction
  | GenresFilterChangedAction
  | PerformerFilterChangedAction
  | ReleaseYearFilterChangedAction
  | ShowMoreAction
  | SortAction<WatchlistSort>
  | TitleFilterChangedAction
  | WriterFilterChangedAction;

export type WatchlistFiltersValues = {
  collection?: readonly string[];
  director?: readonly string[];
  genres?: readonly string[];
  performer?: readonly string[];
  releaseYear?: [string, string];
  title?: string;
  writer?: readonly string[];
};

type WatchlistState = {
  activeFilterValues: WatchlistFiltersValues;
  pendingFilterValues: WatchlistFiltersValues;
  showCount: number;
  sort: WatchlistSort;
  values: WatchlistValue[];
};

const watchlistComposedReducer = composeReducers<WatchlistState>(
  filtersLifecycleReducer,
  titleFacetReducer,
  genresFacetReducer,
  releaseYearFacetReducer,
  directorFacetReducer,
  performerFacetReducer,
  writerFacetReducer,
  collectionFacetReducer,
  sortReducer,
  // AIDEV-NOTE: Reset pagination whenever sort changes.
  (state, action) =>
    action.type === "sort/sort"
      ? { ...state, ...createInitialShowMoreState() }
      : state,
  showMoreReducer,
);

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: WatchlistSort;
  values: WatchlistValue[];
}): WatchlistState {
  return {
    ...createInitialFiltersState({ values }),
    ...createInitialShowMoreState(),
    ...createInitialSortState({ initialSort }),
  };
}

export function reducer(
  state: WatchlistState,
  action: WatchlistAction,
): WatchlistState {
  return watchlistComposedReducer(state, action);
}

export const createSortAction = createSortActionCreator<WatchlistSort>();
