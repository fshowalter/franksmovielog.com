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

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

export { createRemoveAppliedFilterAction } from "~/reducers/filtersReducer";
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
 * Union type of all actions for cast and crew member titles state management.
 */
export type CastAndCrewMemberTitlesAction =
  | CreditedAsFilterChangedAction
  | MaybeReviewedTitleFiltersAction
  | SortAction<CastAndCrewMemberTitlesSort>;

/**
 * Filter values for cast and crew member titles.
 */
export type CastAndCrewMemberTitlesFiltersValues =
  MaybeReviewedTitleFiltersValues & {
    creditedAs?: readonly string[];
  };

/**
 * Internal state type for cast and crew member titles reducer.
 */
type CastAndCrewMemberTitlesState = Omit<
  MaybeReviewedTitleFiltersState<CastAndCrewMemberTitlesValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  SortState<CastAndCrewMemberTitlesSort> & {
    activeFilterValues: CastAndCrewMemberTitlesFiltersValues;
    pendingFilterValues: CastAndCrewMemberTitlesFiltersValues;
  };

type CreditedAsFilterChangedAction = {
  type: "castAndCrewMemberTitles/creditedAsFilterChanged";
  values: string[];
};

/**
 * Creates an action for changing the credited-as filter.
 * Supports multiple selection.
 * @param values - The credited roles to filter by
 * @returns Credited-as filter changed action
 */
export function createCreditedAsFilterChangedAction(
  values: string[],
): CreditedAsFilterChangedAction {
  return { type: "castAndCrewMemberTitles/creditedAsFilterChanged", values };
}

/**
 * Creates the initial state for cast and crew member titles page.
 * @param options - Configuration object
 * @param options.initialSort - Initial sort order
 * @param options.values - Array of cast/crew member titles
 * @returns Initial state for the reducer
 */
export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CastAndCrewMemberTitlesSort;
  values: CastAndCrewMemberTitlesValue[];
}): CastAndCrewMemberTitlesState {
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
 * Reducer function for cast and crew member titles page state management.
 * @param state - Current state
 * @param action - Action to process
 * @returns Updated state
 */
export function reducer(
  state: CastAndCrewMemberTitlesState,
  action: CastAndCrewMemberTitlesAction,
) {
  switch (action.type) {
    case "castAndCrewMemberTitles/creditedAsFilterChanged": {
      return handleCreditedAsFilterChanged(state, action);
    }
    case "filters/removeAppliedFilter": {
      return handleRemoveAppliedFilter(state, action);
    }
    case "sort/sort": {
      return sortReducer(state, action);
    }
    default: {
      return maybeReviewedTitleFiltersReducer(state, action);
    }
  }
}

function handleCreditedAsFilterChanged(
  state: CastAndCrewMemberTitlesState,
  action: CreditedAsFilterChangedAction,
): CastAndCrewMemberTitlesState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      creditedAs: action.values.length === 0 ? undefined : action.values,
    },
  };
}

function handleRemoveAppliedFilter(
  state: CastAndCrewMemberTitlesState,
  action: { filterKey: string; type: "filters/removeAppliedFilter" },
): CastAndCrewMemberTitlesState {
  // Handle removal of individual creditedAs values (e.g., "creditedAs-director")
  // Updates BOTH pendingFilterValues and activeFilterValues to ensure UI updates.
  if (action.filterKey.startsWith("creditedAs-")) {
    const creditValue = action.filterKey.replace(/^creditedAs-/, "");
    // AIDEV-NOTE: Credit values in data are lowercase ("director", "performer", "writer")
    // Do NOT capitalize - use as-is to match actual data format

    const currentCreditedAs = state.pendingFilterValues.creditedAs ?? [];
    const newCreditedAs = currentCreditedAs.filter((c) => c !== creditValue);

    return {
      ...state,
      activeFilterValues: {
        ...state.activeFilterValues,
        creditedAs: newCreditedAs.length === 0 ? undefined : newCreditedAs,
      },
      pendingFilterValues: {
        ...state.pendingFilterValues,
        creditedAs: newCreditedAs.length === 0 ? undefined : newCreditedAs,
      },
    };
  }

  // For all other filters, delegate to base reducer
  return maybeReviewedTitleFiltersReducer(state, action);
}

/**
 * Action creator for cast and crew member titles sort actions.
 */
export const createSortAction =
  createSortActionCreator<CastAndCrewMemberTitlesSort>();
