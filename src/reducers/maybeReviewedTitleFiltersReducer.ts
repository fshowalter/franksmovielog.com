import type {
  RemoveAppliedFilterAction,
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
  reviewedStatus?: readonly string[];
};

type ReviewedStatusFilterChangedAction = {
  type: "maybeReviewedTitleFilters/reviewedStatusFilterChanged";
  values: readonly string[];
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
 * @param values - The reviewed status values (e.g., ["Reviewed"], ["Not Reviewed"], ["Reviewed", "Not Reviewed"])
 * @returns Reviewed status filter changed action
 */
export function createReviewedStatusFilterChangedAction(
  values: readonly string[],
): ReviewedStatusFilterChangedAction {
  return {
    type: "maybeReviewedTitleFilters/reviewedStatusFilterChanged",
    values,
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
    case "filters/removeAppliedFilter": {
      return handleRemoveAppliedFilter<TValue, TState>(state, action);
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
      reviewedStatus: action.values,
    },
  };
}

function handleRemoveAppliedFilter<
  TValue,
  TState extends MaybeReviewedTitleFiltersState<TValue>,
>(state: TState, action: RemoveAppliedFilterAction): TState {
  // Handle removal of individual reviewedStatus values (e.g., "reviewedStatus-reviewed")
  if (action.filterKey.startsWith("reviewedStatus-")) {
    const statusValue = action.filterKey
      .replace(/^reviewedStatus-/, "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const currentStatus = state.pendingFilterValues.reviewedStatus ?? [];
    const newStatus = currentStatus.filter((s) => s !== statusValue);

    return {
      ...state,
      pendingFilterValues: {
        ...state.pendingFilterValues,
        reviewedStatus: newStatus.length === 0 ? undefined : newStatus,
      },
    };
  }

  // For all other filters, use the default behavior from reviewedTitleFiltersReducer
  return reviewedTitleFiltersReducer<TValue, TState>(state, action);
}
