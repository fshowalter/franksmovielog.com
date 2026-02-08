import type {
  ReviewedTitleFiltersAction,
  ReviewedTitleFiltersState,
  ReviewedTitleFiltersValues,
} from "./reviewedTitleFiltersReducer";

import {
  createInitialReviewedTitleFiltersState,
  reviewedTitleFiltersReducer,
} from "./reviewedTitleFiltersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
  selectHasPendingFilters,
} from "./reviewedTitleFiltersReducer";

/**
 * Union type of all title-specific filter actions
 */
export type MaybeReviewedTitleFiltersAction =
  | ReviewedStatusFilterChangedAction
  | ReviewedTitleFiltersAction;

/**
 * State shape for maybe-reviewed title filters.
 */
export type MaybeReviewedTitleFiltersState<TValue> = Omit<
  ReviewedTitleFiltersState<TValue>,
  "activeFilterValues" | "pendingFilterValues"
> & {
  activeFilterValues: MaybeReviewedTitleFiltersValues;
  pendingFilterValues: MaybeReviewedTitleFiltersValues;
};

/**
 * Filter values for maybe-reviewed titles.
 */
export type MaybeReviewedTitleFiltersValues = ReviewedTitleFiltersValues & {
  reviewedStatus?: string;
};

type ReviewedStatusFilterChangedAction = {
  type: "maybeReviewedTitleFilters/reviewedStatusFilterChanged";
  value: string;
};

/**
 * Creates initial state for maybe-reviewed title filters.
 * @param options - Configuration object
 * @param options.values - Array of values to filter
 * @returns Initial state for maybe-reviewed title filters
 */
export function createInitialMaybeReviewedTitleFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): MaybeReviewedTitleFiltersState<TValue> {
  return createInitialReviewedTitleFiltersState({
    values,
  });
}

/**
 * Creates an action for changing the reviewed status filter.
 * @param value - The reviewed status value ("All", "Reviewed", "Unreviewed")
 * @returns Reviewed status filter changed action
 */
export function createReviewedStatusFilterChangedAction(
  value: string,
): ReviewedStatusFilterChangedAction {
  return {
    type: "maybeReviewedTitleFilters/reviewedStatusFilterChanged",
    value,
  };
}

/**
 * Reducer function for maybe-reviewed title filter state management.
 * @param state - Current filter state
 * @param action - Action to process
 * @returns Updated state
 */
export function maybeReviewedTitleFiltersReducer<
  TValue,
  TState extends MaybeReviewedTitleFiltersState<TValue>,
>(state: TState, action: MaybeReviewedTitleFiltersAction): TState {
  switch (action.type) {
    case "maybeReviewedTitleFilters/reviewedStatusFilterChanged": {
      return handleReviewedStatusFilterChanged<TValue, TState>(state, action);
    }

    default: {
      return reviewedTitleFiltersReducer<TValue, TState>(state, action);
    }
  }
}

function handleReviewedStatusFilterChanged<
  TValue,
  TState extends MaybeReviewedTitleFiltersState<TValue>,
>(state: TState, action: ReviewedStatusFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      reviewedStatus: action.value,
    },
  };
}
