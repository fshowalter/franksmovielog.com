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

import type { ReviewsValue } from "./Reviews";
import type { ReviewsSort } from "./Reviews.sorter";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type ReviewsActionType = TitleFiltersActionType<ReviewsSort>;

/**
 * Type definition for Reviews page filter values
 */
export type ReviewsFiltersValues = TitleFiltersValues;

/**
 * Internal state type for Reviews page reducer
 */
type ReviewsState = TitleFiltersState<ReviewsValue, ReviewsSort>;

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
  initialSort: ReviewsSort;
  values: ReviewsValue[];
}): ReviewsState {
  return createInitialTitleFiltersState({
    initialSort,
    values,
  });
}

/**
 * Reducer function for managing Reviews page state.
 * Handles filtering, sorting, and pagination actions for the reviews list.
 */
export const reviewsReducer = createTitleFiltersReducer<
  ReviewsValue,
  ReviewsSort,
  ReviewsState
>();

/**
 * Action creator for sort actions specific to the Reviews page.
 */
export const createSortAction = createSortActionCreator<ReviewsSort>();
