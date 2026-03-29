import type { CreditedAsFilterChangedAction } from "~/components/filter-and-sort/facets/credited-as/creditedAsReducer";

import { composeReducers } from "~/components/filter-and-sort/facets/composeReducers";
import { creditedAsFacetReducer } from "~/components/filter-and-sort/facets/credited-as/creditedAsReducer";
import { nameFacetReducer } from "~/components/filter-and-sort/facets/name/nameReducer";

export { createNameFilterChangedAction } from "~/components/filter-and-sort/facets/name/nameReducer";

import type { FilterAndSortContainerAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import type { NameFilterChangedAction } from "~/components/filter-and-sort/facets/name/nameReducer";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/filter-and-sort/container/filterAndSortContainerReducer";

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewSort } from "./sortCastAndCrew";

/**
 * Union type of all actions for cast and crew state management.
 */
export type CastAndCrewAction =
  | CreditedAsFilterChangedAction
  | FilterAndSortContainerAction<CastAndCrewSort>
  | NameFilterChangedAction;

/**
 * Filter values for cast and crew.
 */
export type CastAndCrewFiltersValues = {
  creditedAs?: readonly string[];
  name?: string;
};

/**
 * Internal state type for cast and crew reducer.
 */
type CastAndCrewState = {
  activeFilterValues: CastAndCrewFiltersValues;
  pendingFilterValues: CastAndCrewFiltersValues;
  sort: CastAndCrewSort;
  values: CastAndCrewValue[];
};

const castAndCrewComposedReducer = composeReducers<CastAndCrewState>(
  filterAndSortContainerReducer,
  nameFacetReducer,
  creditedAsFacetReducer,
);

/**
 * Creates the initial state for cast and crew.
 * @param options - Configuration options
 * @param options.initialSort - Initial sort configuration
 * @param options.values - Cast and crew values
 * @returns Initial state for cast and crew reducer
 */
export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CastAndCrewSort;
  values: CastAndCrewValue[];
}): CastAndCrewState {
  return {
    ...createInitialFilterAndSortContainerState({ initialSort, values }),
  };
}

/**
 * Reducer function for cast and crew state management.
 * @param state - Current state
 * @param action - Action to process
 * @returns Updated state
 */
export function reducer(
  state: CastAndCrewState,
  action: CastAndCrewAction,
): CastAndCrewState {
  return castAndCrewComposedReducer(state, action);
}
