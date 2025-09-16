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
  selectHasPendingFilters,
} from "~/reducers/titleFiltersReducer";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type WatchlistAction =
  | ShowMoreAction
  | SortAction<WatchlistSort>
  | TitleFiltersAction
  | WatchlistFilterChangedAction;

import type { WatchlistSort } from "./sortWatchlistValues";
import type { WatchlistValue } from "./Watchlist";

/**
 * Type definition for Reviews page filter values
 */
export type WatchlistFiltersValues = ExtraWatchlistFiltersValues &
  TitleFiltersValues;

type ExtraWatchlistFiltersValues = {
  collection?: string;
  director?: string;
  performer?: string;
  writer?: string;
};

type WatchlistFilterChangedAction = {
  filter: keyof ExtraWatchlistFiltersValues;
  type: "watchlist/filterChanged";
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

export function createWatchlistFilterChangedAction(
  filter: keyof ExtraWatchlistFiltersValues,
  value: string,
): WatchlistFilterChangedAction {
  return { filter, type: "watchlist/filterChanged", value };
}

/**
 * Reducer function for managing Reviews page state.
 * Handles filtering, sorting, and pagination actions for the reviews list.
 */
export function reducer(state: WatchlistState, action: WatchlistAction) {
  switch (action.type) {
    case "showMore/showMore": {
      return showMoreReducer(state, action);
    }
    case "sort/sort": {
      return sortReducer(state, action);
    }
    case "watchlist/filterChanged": {
      return handleWatchlistFilterChanged(state, action);
    }
    default: {
      return titleFiltersReducer(state, action);
    }
  }
}

function handleWatchlistFilterChanged(
  state: WatchlistState,
  action: WatchlistFilterChangedAction,
): WatchlistState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      [action.filter]: action.value === "All" ? undefined : action.value,
    },
  };
}

/**
 * Action creator for sort actions specific to the Watchlist page.
 */
export const createSortAction = createSortActionCreator<WatchlistSort>();
