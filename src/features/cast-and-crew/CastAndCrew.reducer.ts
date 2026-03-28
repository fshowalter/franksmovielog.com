import type { FiltersAction } from "~/reducers/filtersReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { composeReducers } from "~/facets/composeReducers";
import { creditedAsFacetReducer } from "~/facets/creditedAs/creditedAsReducer";
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

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewSort } from "./sortCastAndCrew";

/**
 * Union type of all actions for cast and crew state management.
 */
export type CastAndCrewAction =
  | CreditedAsFilterChangedAction
  | FiltersAction
  | NameFilterChangedAction
  | SortAction<CastAndCrewSort>;

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

type CreditedAsFilterChangedAction = {
  type: "creditedAs/changed";
  values: readonly string[];
};

/**
 * Creates an action for changing the credited-as filter.
 * @param values - The credited roles to filter by
 * @returns Credited-as filter changed action
 */
export function createCreditedAsFilterChangedAction(
  values: readonly string[],
): CreditedAsFilterChangedAction {
  return { type: "creditedAs/changed", values };
}

const castAndCrewComposedReducer = composeReducers<CastAndCrewState>(
  filtersLifecycleReducer,
  nameFacetReducer,
  creditedAsFacetReducer,
  (state, action): CastAndCrewState => {
    if (action.type !== "creditedAs/changed") return state;
    // AIDEV-NOTE: Update both activeFilterValues and pendingFilterValues to ensure
    // chips disappear immediately when clicked (not just when "Apply" is clicked).
    const { values } = action as CreditedAsFilterChangedAction;
    return {
      ...state,
      activeFilterValues: {
        ...state.activeFilterValues,
        creditedAs: values.length === 0 ? undefined : values,
      },
      pendingFilterValues: {
        ...state.pendingFilterValues,
        creditedAs: values.length === 0 ? undefined : values,
      },
    };
  },
  sortReducer,
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
    ...createInitialFiltersState({ values }),
    ...createInitialSortState({ initialSort }),
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

/**
 * Action creator for cast and crew sort actions.
 */
export const createSortAction = createSortActionCreator<CastAndCrewSort>();
