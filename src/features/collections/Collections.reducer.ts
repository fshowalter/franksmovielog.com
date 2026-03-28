import type { FiltersAction } from "~/reducers/filtersReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { composeReducers } from "~/facets/composeReducers";
import { nameFacetReducer } from "~/facets/name/nameReducer";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
} from "~/reducers/filtersReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export { createNameFilterChangedAction } from "~/facets/name/nameReducer";

import type { NameFilterChangedAction } from "~/facets/name/nameReducer";

import type { CollectionsValue } from "./Collections";
import type { CollectionsSort } from "./sortCollections";

/**
 * Union type of all collection-specific filter and sort actions
 */
export type CollectionsAction =
  | FiltersAction
  | NameFilterChangedAction
  | SortAction<CollectionsSort>;

/**
 * Type definition for Collections filter values
 */
export type CollectionsFiltersValues = {
  name?: string;
};

/**
 * Internal state type for Collections reducer
 */
type CollectionsState = {
  activeFilterValues: CollectionsFiltersValues;
  pendingFilterValues: CollectionsFiltersValues;
  sort: CollectionsSort;
  values: CollectionsValue[];
};

const collectionsComposedReducer = composeReducers<CollectionsState>(
  filtersLifecycleReducer,
  nameFacetReducer,
  sortReducer,
);

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CollectionsSort;
  values: CollectionsValue[];
}): CollectionsState {
  return {
    ...createInitialFiltersState({ values }),
    ...createInitialSortState({ initialSort }),
  };
}

/**
 * Reducer function for managing Collections state.
 * Handles filtering and sorting actions for the collections list.
 */
export function reducer(
  state: CollectionsState,
  action: CollectionsAction,
): CollectionsState {
  return collectionsComposedReducer(state, action);
}

/**
 * Action creator for sort actions specific to Collections.
 */
export const createSortAction = createSortActionCreator<CollectionsSort>();
