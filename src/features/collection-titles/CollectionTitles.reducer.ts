import type {
  MaybeReviewedTitleFiltersAction,
  MaybeReviewedTitleFiltersState,
  MaybeReviewedTitleFiltersValues,
} from "~/reducers/maybeReviewedTitleFiltersReducer";
import type { SortAction, SortState } from "~/reducers/sortReducer";

import {
  createInitialMaybeReviewedTitleFiltersState,
  maybeReviewedTitleFiltersReducer,
} from "~/reducers/maybeReviewedTitleFiltersReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesSort } from "./sortCollectionTitles";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createResetFiltersAction,
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
  selectHasPendingFilters,
} from "~/reducers/maybeReviewedTitleFiltersReducer";

/**
 * Union type of all actions for collection titles state management.
 */
export type CollectionTitlesAction =
  | MaybeReviewedTitleFiltersAction
  | SortAction<CollectionTitlesSort>;

/**
 * Filter values for collection titles.
 */
export type CollectionTitlesFiltersValues = MaybeReviewedTitleFiltersValues;

type CollectionTitlesState = Omit<
  MaybeReviewedTitleFiltersState<CollectionTitlesValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  SortState<CollectionTitlesSort> & {
    activeFilterValues: CollectionTitlesFiltersValues;
    pendingFilterValues: CollectionTitlesFiltersValues;
  };

/**
 * Creates the initial state for collection titles.
 * @param options - Configuration options
 * @param options.initialSort - Initial sort configuration
 * @param options.values - Collection title values
 * @returns Initial state for collection titles reducer
 */
export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CollectionTitlesSort;
  values: CollectionTitlesValue[];
}): CollectionTitlesState {
  const sortState = createInitialSortState({ initialSort });
  const reviewedTitleFilterState = createInitialMaybeReviewedTitleFiltersState({
    values,
  });

  return {
    ...reviewedTitleFilterState,
    ...sortState,
  };
}

/**
 * Reducer function for collection titles state management.
 * @param state - Current state
 * @param action - Action to process
 * @returns Updated state
 */
export function reducer(
  state: CollectionTitlesState,
  action: CollectionTitlesAction,
) {
  switch (action.type) {
    case "sort/sort": {
      return sortReducer(state, action);
    }
    default: {
      return maybeReviewedTitleFiltersReducer(state, action);
    }
  }
}

/**
 * Action creator for collection titles sort actions.
 */
export const createSortAction = createSortActionCreator<CollectionTitlesSort>();
