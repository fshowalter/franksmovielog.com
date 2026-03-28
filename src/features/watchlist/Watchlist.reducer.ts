import type { FilterAndSortContainerAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import type { ShowMoreAction } from "~/reducers/showMoreReducer";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { collectionsFacetReducer } from "~/components/filter-and-sort/facets/collections/collectionsReducer";
import { composeReducers } from "~/components/filter-and-sort/facets/composeReducers";
import { directorsFacetReducer } from "~/components/filter-and-sort/facets/directors/directorsReducer";
import { genresFacetReducer } from "~/components/filter-and-sort/facets/genres/genresReducer";
import { performersFacetReducer } from "~/components/filter-and-sort/facets/performers/performersReducer";
import { releaseYearFacetReducer } from "~/components/filter-and-sort/facets/releaseYear/releaseYearReducer";
import { titleFacetReducer } from "~/components/filter-and-sort/facets/title/titleReducer";
import { writersFacetReducer } from "~/components/filter-and-sort/facets/writers/writersReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/reducers/showMoreReducer";

export { createCollectionFilterChangedAction } from "~/components/filter-and-sort/facets/collection/collectionReducer";
export { createDirectorFilterChangedAction } from "~/components/filter-and-sort/facets/directors/directorReducer";
export { createGenresFilterChangedAction } from "~/components/filter-and-sort/facets/genres/genreReducer";
export { createPerformerFilterChangedAction } from "~/components/filter-and-sort/facets/performer/performerReducer";
export { createReleaseYearFilterChangedAction } from "~/components/filter-and-sort/facets/releaseYear/releaseYearReducer";
export { createTitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";
export { createWriterFilterChangedAction } from "~/components/filter-and-sort/facets/writer/writerReducer";
export { createRemoveAppliedFilterAction } from "~/reducers/filtersReducer";
export { createShowMoreAction } from "~/reducers/showMoreReducer";

import type { CollectionFilterChangedAction } from "~/components/filter-and-sort/facets/collection/collectionReducer";
import type { DirectorFilterChangedAction } from "~/components/filter-and-sort/facets/directors/directorReducer";
import type { GenresFilterChangedAction } from "~/components/filter-and-sort/facets/genres/genreReducer";
import type { PerformerFilterChangedAction } from "~/components/filter-and-sort/facets/performer/performerReducer";
import type { ReleaseYearFilterChangedAction } from "~/components/filter-and-sort/facets/releaseYear/releaseYearReducer";
import type { TitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";
import type { WriterFilterChangedAction } from "~/components/filter-and-sort/facets/writer/writerReducer";

import type { WatchlistSort } from "./sortWatchlistValues";
import type { WatchlistValue } from "./Watchlist";

export type WatchlistAction =
  | CollectionFilterChangedAction
  | DirectorsFilterChangedAction
  | FilterAndSortContainerAction<WatchlistSort>
  | GenresFilterChangedAction
  | PerformersFilterChangedAction
  | ReleaseYearFilterChangedAction
  | ShowMoreAction
  | TitleFilterChangedAction
  | WritersFilterChangedAction;

export type WatchlistFiltersValues = {
  collections?: readonly string[];
  directors?: readonly string[];
  genres?: readonly string[];
  performers?: readonly string[];
  releaseYear?: [string, string];
  title?: string;
  writers?: readonly string[];
};

type WatchlistState = {
  activeFilterValues: WatchlistFiltersValues;
  pendingFilterValues: WatchlistFiltersValues;
  showCount: number;
  sort: WatchlistSort;
  values: WatchlistValue[];
};

const watchlistReducer = composeReducers<WatchlistState>(
  filterAndSortContainerReducer,
  titleFacetReducer,
  genresFacetReducer,
  releaseYearFacetReducer,
  directorsFacetReducer,
  performersFacetReducer,
  writersFacetReducer,
  collectionsFacetReducer,
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
    ...createInitialFilterAndSortContainerState({ initialSort, values }),
    ...createInitialShowMoreState(),
  };
}

export function reducer(
  state: WatchlistState,
  action: WatchlistAction,
): WatchlistState {
  return watchlistReducer(state, action);
}
