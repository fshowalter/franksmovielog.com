import {
  createInitialTitleFiltersState,
  createSortActionCreator,
  createTitleFiltersReducer,
  type TitleFiltersActionType,
  type TitleFiltersState,
  type TitleFiltersValues,
} from "~/components/filter-and-sort/title.filters.reducer";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetGenresPendingFilterAction,
  createSetReleaseYearPendingFilterAction,
  createSetTitlePendingFilterAction,
} from "~/components/filter-and-sort/title.filters.reducer";

import {
  createSortTitleValues,
  createSortValues,
  createTitleSortMap,
  type TitleSort,
} from "~/components/filter-and-sort/title.sorter";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type WatchlistActionType = TitleFiltersActionType<TitleSort>;

import {
  createInitialShowMoreState,
  type ShowMoreState,
} from "~/components/filter-and-sort/showMore.reducer";

import type { WatchlistValue } from "./Watchlist";

/**
 * Type definition for Reviews page filter values
 */
export type WatchlistFiltersValues = TitleFiltersValues;

export type WatchlistSort = TitleSort;

/**
 * Internal state type for Reviews page reducer
 */
type WatchlistState = ShowMoreState &
  TitleFiltersState<WatchlistValue, WatchlistSort>;

const sortValues = createSortTitleValues<WatchlistValue, WatchlistSort>();

/**
 * Initializes the state for the Reviews page reducer.
 * Sets up initial filtering state, sort order, and processes the review values.
 *
 * @param params - Initialization parameters
 * @param params.initialSort - Initial sort order for the reviews
 * @param params.values - Array of review data to initialize with
 * @returns Initial state for the Reviews page reducer
 */
export function initState({
  initialSort,
  values,
}: {
  initialSort: WatchlistSort;
  values: WatchlistValue[];
}): WatchlistState {
  const showMoreState = createInitialShowMoreState();
  const titleFilterState = createInitialTitleFiltersState({
    initialSort,
    sorter: sortValues,
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
>({ sorter: sortValues });

/**
 * Action creator for sort actions specific to the Watchlist page.
 */
export const createSortAction = createSortActionCreator<WatchlistSort>();
