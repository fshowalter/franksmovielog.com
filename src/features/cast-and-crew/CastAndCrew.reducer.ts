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

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewSort } from "./sortCastAndCrew";

/**
 * Union type of all actions for cast and crew state management.
 */
export type CastAndCrewAction =
  | CollectionFiltersAction
  | CreditedAsFilterChangedAction
  | SortAction<CastAndCrewSort>;

/**
 * Filter values for cast and crew.
 */
export type CastAndCrewFiltersValues = CollectionFiltersValues & {
  creditedAs?: string;
};

/**
 * Internal state type for cast and crew reducer.
 */
type CastAndCrewState = Omit<
  CollectionFiltersState<CastAndCrewValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  SortState<CastAndCrewSort> & {
    activeFilterValues: CastAndCrewFiltersValues;
    pendingFilterValues: CastAndCrewFiltersValues;
  };

type CreditedAsFilterChangedAction = {
  type: "castAndCrew/creditedAsFilterChanged";
  value: string;
};

/**
 * Creates an action for changing the credited-as filter.
 * @param value - The credited role to filter by
 * @returns Credited-as filter changed action
 */
export function createCreditedAsFilterChangedAction(
  value: string,
): CreditedAsFilterChangedAction {
  return { type: "castAndCrew/creditedAsFilterChanged", value };
}

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
 * Reducer function for cast and crew state management.
 * @param state - Current state
 * @param action - Action to process
 * @returns Updated state
 */
export function reducer(state: CastAndCrewState, action: CastAndCrewAction) {
  switch (action.type) {
    case "castAndCrew/creditedAsFilterChanged": {
      return handleCreditedAsFilterChanged(state, action);
    }
    case "sort/sort": {
      return sortReducer(state, action);
    }
    default: {
      return collectionFiltersReducer(state, action);
    }
  }
}

function handleCreditedAsFilterChanged(
  state: CastAndCrewState,
  action: CreditedAsFilterChangedAction,
): CastAndCrewState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      creditedAs: action.value === "All" ? undefined : action.value,
    },
  };
}

/**
 * Action creator for cast and crew sort actions.
 */
export const createSortAction = createSortActionCreator<CastAndCrewSort>();
