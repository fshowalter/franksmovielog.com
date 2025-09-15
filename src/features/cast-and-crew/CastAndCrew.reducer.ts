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

export { createShowMoreAction } from "~/reducers/showMoreReducer";

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
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type CastAndCrewAction =
  | CollectionFiltersAction
  | CreditedAsFilterChangedAction
  | SortAction<CastAndCrewSort>;

/**
 * Type definition for Reviews page filter values
 */
export type CastAndCrewFiltersValues = CollectionFiltersValues & {
  creditedAs?: string;
};

/**
 * Internal state type for Reviews page reducer
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

export function createCreditedAsFilterChangedAction(
  value: string,
): CreditedAsFilterChangedAction {
  return { type: "castAndCrew/creditedAsFilterChanged", value };
}

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
 * Reducer function for managing Reviews page state.
 * Handles filtering, sorting, and pagination actions for the reviews list.
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
      creditedAs: action.value,
    },
  };
}

/**
 * Action creator for sort actions specific to the Watchlist page.
 */
export const createSortAction = createSortActionCreator<CastAndCrewSort>();
