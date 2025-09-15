import type { ReviewedTitleFiltersAction, ReviewedTitleFiltersState, ReviewedTitleFiltersValues } from "./reviewedTitleFiltersReducer";

import { createInitialReviewedTitleFiltersState, reviewedTitleFiltersReducer } from "./reviewedTitleFiltersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
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

export type MaybeReviewedTitleFiltersState<TValue> = Omit<
  ReviewedTitleFiltersState<TValue>,
  "activeFilterValues" | "pendingFilterValues"
> & {
  activeFilterValues: MaybeReviewedTitleFiltersValues;
  pendingFilterValues: MaybeReviewedTitleFiltersValues;
};

export type MaybeReviewedTitleFiltersValues = ReviewedTitleFiltersValues & {
  reviewedStatus?: string;
};

type ReviewedStatusFilterChangedAction = {
  type: "maybeReviewedTitleFilters/reviewedStatusFilterChanged";
  value: string;
};

export function createInitialMaybeReviewedTitleFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): MaybeReviewedTitleFiltersState<TValue> {
  return createInitialReviewedTitleFiltersState({
    values,
  });
}

export function createReviewedStatusFilterChangedAction(
  value: string,
): ReviewedStatusFilterChangedAction {
  return {
    type: "maybeReviewedTitleFilters/reviewedStatusFilterChanged",
    value,
  };
}

// Create reducer function
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
