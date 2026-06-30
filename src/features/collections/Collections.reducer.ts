import type { FilterAndSortContainerAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import type { NameFilterChangedAction } from "~/components/filter-and-sort/facets/name/nameReducer";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { composeReducers } from "~/components/filter-and-sort/facets/composeReducers";
import { nameFacetReducer } from "~/components/filter-and-sort/facets/name/nameReducer";

import type { CollectionsValue } from "./Collections";
import type { CollectionsSort } from "./sortCollections";

/**
 * Union type of all collection-specific filter and sort actions
 */
export type CollectionsAction =
  FilterAndSortContainerAction<CollectionsSort> | NameFilterChangedAction;

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
  filterAndSortContainerReducer,
  nameFacetReducer,
);

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CollectionsSort;
  values: CollectionsValue[];
}): CollectionsState {
  return {
    ...createInitialFilterAndSortContainerState({ initialSort, values }),
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
