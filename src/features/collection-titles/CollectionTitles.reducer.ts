import type {
  MaybeReviewedTitleFiltersAction,
  MaybeReviewedTitleFiltersState,
  MaybeReviewedTitleFiltersValues,
} from "~/reducers/maybeReviewedTitleFiltersReducer";
import type { ShowMoreAction, ShowMoreState } from "~/reducers/showMoreReducer";
import type { SortAction, SortState } from "~/reducers/sortReducer";

import {
  createInitialMaybeReviewedTitleFiltersState,
  maybeReviewedTitleFiltersReducer,
} from "~/reducers/maybeReviewedTitleFiltersReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/reducers/showMoreReducer";
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

export { createShowMoreAction } from "~/reducers/showMoreReducer";

/**
 * Union type of all actions for collection titles state management.
 */
export type CollectionTitlesAction =
  | MaybeReviewedTitleFiltersAction
  | ShowMoreAction
  | SortAction<CollectionTitlesSort>;

/**
 * Filter values for collection titles.
 */
export type CollectionTitlesFiltersValues = MaybeReviewedTitleFiltersValues;

type CollectionTitlesState = Omit<
  MaybeReviewedTitleFiltersState<CollectionTitlesValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  ShowMoreState &
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
  const showMoreState = createInitialShowMoreState();
  const sortState = createInitialSortState({ initialSort });
  const reviewedTitleFilterState = createInitialMaybeReviewedTitleFiltersState({
    values,
  });

  return {
    ...reviewedTitleFilterState,
    ...showMoreState,
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
    case "showMore/showMore": {
      return showMoreReducer(state, action);
    }
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
