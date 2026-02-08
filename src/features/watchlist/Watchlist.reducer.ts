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
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createTitleFilterChangedAction,
  selectHasPendingFilters,
} from "~/reducers/titleFiltersReducer";

/**
 * Union type of all actions for watchlist state management.
 */
export type WatchlistAction =
  | ShowMoreAction
  | SortAction<WatchlistSort>
  | TitleFiltersAction
  | WatchlistFilterChangedAction;

import type { WatchlistSort } from "./sortWatchlistValues";
import type { WatchlistValue } from "./Watchlist";

/**
 * Filter values for watchlist.
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
 * Internal state type for watchlist reducer.
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
 * Creates the initial state for watchlist.
 * @param options - Configuration options
 * @param options.initialSort - Initial sort configuration
 * @param options.values - Watchlist values
 * @returns Initial state for watchlist reducer
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

/**
 * Creates an action for changing watchlist-specific filters.
 * @param filter - The filter to change
 * @param value - The new filter value
 * @returns Watchlist filter changed action
 */
export function createWatchlistFilterChangedAction(
  filter: keyof ExtraWatchlistFiltersValues,
  value: string,
): WatchlistFilterChangedAction {
  return { filter, type: "watchlist/filterChanged", value };
}

/**
 * Reducer function for watchlist state management.
 * @param state - Current state
 * @param action - Action to process
 * @returns Updated state
 */
export function reducer(state: WatchlistState, action: WatchlistAction) {
  switch (action.type) {
    case "showMore/showMore": {
      return showMoreReducer(state, action);
    }
    case "sort/sort": {
      const newState = sortReducer(state, action);
      // Reset pagination when sort changes
      return {
        ...newState,
        ...createInitialShowMoreState(),
      };
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
 * Action creator for watchlist sort actions.
 */
export const createSortAction = createSortActionCreator<WatchlistSort>();
