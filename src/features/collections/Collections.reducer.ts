import type { SortAction, SortState } from "~/reducers/sortReducer";

import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createNameFilterChangedAction,
  createResetFiltersAction,
  selectHasPendingFilters,
} from "~/reducers/collectionFiltersReducer";

import type {
  CollectionFiltersAction,
  CollectionFiltersState,
  CollectionFiltersValues,
} from "~/reducers/collectionFiltersReducer";

import {
  collectionFiltersReducer,
  createInitialCollectionFiltersState,
} from "~/reducers/collectionFiltersReducer";

import type { CollectionsValue } from "./Collections";
import type { CollectionsSort } from "./sortCollections";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type CollectionsAction =
  | CollectionFiltersAction
  | SortAction<CollectionsSort>;

/**
 * Type definition for Reviews page filter values
 */
export type CollectionsFiltersValues = CollectionFiltersValues;

/**
 * Internal state type for Reviews page reducer
 */
type CollectionsState = Omit<
  CollectionFiltersState<CollectionsValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  SortState<CollectionsSort> & {
    activeFilterValues: CollectionsFiltersValues;
    pendingFilterValues: CollectionsFiltersValues;
  };

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CollectionsSort;
  values: CollectionsValue[];
}): CollectionsState {
  const sortState = createInitialSortState({ initialSort });
  const collectionFiltersState = createInitialCollectionFiltersState({
    values,
  });

  return {
    ...collectionFiltersState,
    ...sortState,
  };
}

/**
 * Reducer function for managing Reviews page state.
 * Handles filtering, sorting, and pagination actions for the reviews list.
 */
export function reducer(state: CollectionsState, action: CollectionsAction) {
  switch (action.type) {
    case "sort/sort": {
      return sortReducer(state, action);
    }
    default: {
      return collectionFiltersReducer(state, action);
    }
  }
}

/**
 * Action creator for sort actions specific to the Watchlist page.
 */
export const createSortAction = createSortActionCreator<CollectionsSort>();
