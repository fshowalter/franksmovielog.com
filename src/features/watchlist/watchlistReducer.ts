import type { FilterAndSortContainerAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import type { CollectionsFilterChangedAction } from "~/components/filter-and-sort/facets/collections/collectionsReducer";
import type { DirectorsFilterChangedAction } from "~/components/filter-and-sort/facets/directors/directorsReducer";
import type { GenresFilterChangedAction } from "~/components/filter-and-sort/facets/genres/genresReducer";
import type { PerformersFilterChangedAction } from "~/components/filter-and-sort/facets/performers/performersReducer";
import type { ReleaseYearFilterChangedAction } from "~/components/filter-and-sort/facets/release-year/releaseYearReducer";
import type { TitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";
import type { WritersFilterChangedAction } from "~/components/filter-and-sort/facets/writers/writersReducer";
import type { ShowMoreAction } from "~/components/filter-and-sort/paginated-list/paginationReducer";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { collectionsFacetReducer } from "~/components/filter-and-sort/facets/collections/collectionsReducer";
import { composeReducers } from "~/components/filter-and-sort/facets/composeReducers";
import { directorsFacetReducer } from "~/components/filter-and-sort/facets/directors/directorsReducer";
import { genresFacetReducer } from "~/components/filter-and-sort/facets/genres/genresReducer";
import { performersFacetReducer } from "~/components/filter-and-sort/facets/performers/performersReducer";
import { releaseYearFacetReducer } from "~/components/filter-and-sort/facets/release-year/releaseYearReducer";
import { titleFacetReducer } from "~/components/filter-and-sort/facets/title/titleReducer";
import { writersFacetReducer } from "~/components/filter-and-sort/facets/writers/writersReducer";
import {
  createInitialPaginationState,
  paginationReducer,
} from "~/components/filter-and-sort/paginated-list/paginationReducer";

import type { WatchlistSort } from "./sortWatchlist";
import type { WatchlistValue } from "./Watchlist";

export type WatchlistAction =
  | CollectionsFilterChangedAction
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
  paginationReducer,
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
    ...createInitialPaginationState(),
  };
}

export function reducer(
  state: WatchlistState,
  action: WatchlistAction,
): WatchlistState {
  return watchlistReducer(state, action);
}
