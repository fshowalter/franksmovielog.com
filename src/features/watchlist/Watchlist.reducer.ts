import {
  createInitialTitleFiltersState,
  createSortActionCreator,
  createTitleFiltersReducer,
  type TitleFiltersActionType,
  type TitleFiltersState,
  type TitleFiltersValues,
} from "~/components/filter-and-sort/TitleFilters.reducer";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetGenresPendingFilterAction,
  createSetReleaseYearPendingFilterAction,
  createSetTitlePendingFilterAction,
} from "~/components/filter-and-sort/TitleFilters.reducer";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type WatchlistActionType = TitleFiltersActionType<WatchlistSort>;

import {
  createInitialShowMoreState,
  type ShowMoreState,
} from "~/components/filter-and-sort/showMore.reducer";

import type { WatchlistValue } from "./Watchlist";
import type { WatchlistSort } from "./Watchlist.selectors";

/**
 * Type definition for Reviews page filter values
 */
export type WatchlistFiltersValues = TitleFiltersValues;

/**
 * Internal state type for Reviews page reducer
 */
type WatchlistState = ShowMoreState &
  TitleFiltersState<WatchlistValue, WatchlistSort>;

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
  const titleFilterState = createInitialTitleFiltersState({
    initialSort,
    values,
  });

  return {
    ...titleFilterState,
    ...showMoreState,
  };
}

/**
 * Reducer function for managing Reviews page state.
 * Handles filtering, sorting, and pagination actions for the reviews list.
 */
export const watchlistReducer = createTitleFiltersReducer<
  WatchlistValue,
  WatchlistSort,
  WatchlistState
>();

/**
 * Action creator for sort actions specific to the Watchlist page.
 */
export const createSortAction = createSortActionCreator<WatchlistSort>();
