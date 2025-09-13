import type { ShowMoreAction, ShowMoreState } from "~/reducers/showMoreReducer";
import type { SortAction, SortState } from "~/reducers/sortReducer";
import type {
  TitleFiltersAction,
  TitleFiltersState,
  TitleFiltersValues,
} from "~/reducers/titleFiltersReducer";

import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/reducers/showMoreReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";
import {
  createInitialTitleFiltersState,
  titleFiltersReducer,
} from "~/reducers/titleFiltersReducer";

export { createShowMoreAction } from "~/reducers/showMoreReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createGenresFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createResetFiltersAction,
  createTitleFilterChangedAction,
} from "~/reducers/titleFiltersReducer";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type WatchlistAction =
  | CollectionFilterChangedAction
  | DirectorFilterChangedAction
  | PerformerFilterChangedAction
  | ShowMoreAction
  | SortAction<WatchlistSort>
  | TitleFiltersAction
  | WriterFilterChangedAction;

import type { WatchlistValue } from "./Watchlist";
import type { WatchlistSort } from "./Watchlist.selectors";

/**
 * Type definition for Reviews page filter values
 */
export type WatchlistFiltersValues = TitleFiltersValues & {
  collection?: string;
  director?: string;
  performer?: string;
  writer?: string;
};

type CollectionFilterChangedAction = {
  type: "watchlist/collectionFilterChanged";
  value: string;
};

type DirectorFilterChangedAction = {
  type: "watchlist/directorFilterChanged";
  value: string;
};

type PerformerFilterChangedAction = {
  type: "watchlist/performerFilterChanged";
  value: string;
};

/**
 * Internal state type for Reviews page reducer
 */
type WatchlistState = Omit<
  TitleFiltersState<WatchlistValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  ShowMoreState &
  SortState<WatchlistSort> & {
    activeFilterValues: WatchlistFiltersValues;
    pendingFilterValues: WatchlistFiltersValues;
  };

type WriterFilterChangedAction = {
  type: "watchlist/writerFilterChanged";
  value: string;
};

export function createCollectionFilterChangedAction(
  value: string,
): CollectionFilterChangedAction {
  return { type: "watchlist/collectionFilterChanged", value };
}

export function createDirectorFilterChangedAction(
  value: string,
): DirectorFilterChangedAction {
  return { type: "watchlist/directorFilterChanged", value };
}

/**
 * Initializes the state for the Reviews page reducer.
 * Sets up initial filtering state, sort order, and processes the review values.
 *
 * @param params - Initialization parameters
 * @param params.initialSort - Initial sort order for the reviews
 * @param params.values - Array of review data to initialize with
 * @returns Initial state for the Reviews page reducer
 */
export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: WatchlistSort;
  values: WatchlistValue[];
}): WatchlistState {
  const showMoreState = createInitialShowMoreState();
  const sortState = createInitialSortState({ initialSort });
  const titleFilterState = createInitialTitleFiltersState({
    values,
  });

  return {
    ...titleFilterState,
    ...showMoreState,
    ...sortState,
  };
}

export function createPerformerFilterChangedAction(
  value: string,
): PerformerFilterChangedAction {
  return { type: "watchlist/performerFilterChanged", value };
}

export function createWriterFilterChangedAction(
  value: string,
): WriterFilterChangedAction {
  return { type: "watchlist/writerFilterChanged", value };
}

/**
 * Reducer function for managing Reviews page state.
 * Handles filtering, sorting, and pagination actions for the reviews list.
 */
export function watchlistReducer(
  state: WatchlistState,
  action: WatchlistAction,
) {
  console.log(action.type);
  switch (action.type) {
    case "showMore/showMore": {
      return showMoreReducer(state, action);
    }
    case "sort/sort": {
      return sortReducer(state, action);
    }
    case "watchlist/collectionFilterChanged": {
      return handleCollectionFilterChanged(state, action);
    }
    case "watchlist/directorFilterChanged": {
      return handleDirectorFilterChanged(state, action);
    }
    case "watchlist/performerFilterChanged": {
      return handlePerformerFilterChanged(state, action);
    }
    case "watchlist/writerFilterChanged": {
      return handleWriterFilterChanged(state, action);
    }
    default: {
      return titleFiltersReducer(state, action);
    }
  }
}

function handleCollectionFilterChanged(
  state: WatchlistState,
  action: CollectionFilterChangedAction,
): WatchlistState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      collection: action.value,
    },
  };
}

function handleDirectorFilterChanged(
  state: WatchlistState,
  action: DirectorFilterChangedAction,
): WatchlistState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      director: action.value,
    },
  };
}

function handlePerformerFilterChanged(
  state: WatchlistState,
  action: PerformerFilterChangedAction,
): WatchlistState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      performer: action.value,
    },
  };
}

function handleWriterFilterChanged(
  state: WatchlistState,
  action: WriterFilterChangedAction,
): WatchlistState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      writer: action.value,
    },
  };
}

/**
 * Action creator for sort actions specific to the Watchlist page.
 */
export const createSortAction = createSortActionCreator<WatchlistSort>();
