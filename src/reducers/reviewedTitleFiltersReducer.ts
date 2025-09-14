import type {
  TitleFiltersAction,
  TitleFiltersState,
  TitleFiltersValues,
} from "./titleFiltersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createGenresFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createResetFiltersAction,
  createTitleFilterChangedAction,
  selectHasPendingFilters,
} from "./titleFiltersReducer";

import {
  createInitialTitleFiltersState,
  titleFiltersReducer,
} from "./titleFiltersReducer";

/**
 * Union type of all title-specific filter actions
 */
export type ReviewedTitleFiltersAction =
  | GradeFilterChangedAction
  | ReviewYearFilterChangedAction
  | TitleFiltersAction;

export type ReviewedTitleFiltersState<TValue> = Omit<
  TitleFiltersState<TValue>,
  "activeFilterValues" | "pendingFilterValues"
> & {
  activeFilterValues: ReviewedTitleFiltersValues;
  pendingFilterValues: ReviewedTitleFiltersValues;
};

export type ReviewedTitleFiltersValues = TitleFiltersValues & {
  gradeValue?: [number, number];
  reviewYear?: [string, string];
};

type GradeFilterChangedAction = {
  type: "reviewedTitleFilters/gradeFilterChanged";
  values: [number, number];
};

type ReviewYearFilterChangedAction = {
  type: "reviewedTitleFilters/reviewYearFilterChanged";
  values: [string, string];
};

export function createGradeFilterChangedAction(
  values: [number, number],
): GradeFilterChangedAction {
  return { type: "reviewedTitleFilters/gradeFilterChanged", values };
}

export function createInitialReviewedTitleFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): ReviewedTitleFiltersState<TValue> {
  const titleFilterState = createInitialTitleFiltersState({
    values,
  });

  return {
    ...titleFilterState,
    activeFilterValues: {},
    pendingFilterValues: {},
  };
}

export function createReviewYearFilterChangedAction(
  values: [string, string],
): ReviewYearFilterChangedAction {
  return { type: "reviewedTitleFilters/reviewYearFilterChanged", values };
}

// Create reducer function
export function reviewedTitleFiltersReducer<
  TValue,
  TState extends ReviewedTitleFiltersState<TValue>,
>(state: TState, action: ReviewedTitleFiltersAction): TState {
  switch (action.type) {
    // Field-specific shared filters
    case "reviewedTitleFilters/gradeFilterChanged": {
      return handleGradeFilterChanged<TValue, TState>(state, action);
    }

    case "reviewedTitleFilters/reviewYearFilterChanged": {
      return handleReviewYearFilterChanged<TValue, TState>(state, action);
    }

    default: {
      return titleFiltersReducer<TValue, TState>(state, action);
    }
  }
}

function handleGradeFilterChanged<
  TValue,
  TState extends ReviewedTitleFiltersState<TValue>,
>(state: TState, action: GradeFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      gradeValue: action.values,
    },
  };
}

function handleReviewYearFilterChanged<
  TValue,
  TState extends ReviewedTitleFiltersState<TValue>,
>(state: TState, action: ReviewYearFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      reviewYear: action.values,
    },
  };
}
