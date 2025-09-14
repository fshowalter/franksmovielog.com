import type {
  FilterableTitle,
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

export type FilterableMaybeReviewedTitle = FilterableTitle & {
  gradeValue?: number;
  reviewYear?: string;
  slug?: string;
};

/**
 * Union type of all title-specific filter actions
 */
export type MaybeReviewedTitleFiltersAction =
  | GradeFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | ReviewYearFilterChangedAction
  | TitleFiltersAction;

export type MaybeReviewedTitleFiltersState<
  TValue extends FilterableMaybeReviewedTitle,
> = Omit<
  TitleFiltersState<TValue>,
  "activeFilterValues" | "pendingFilterValues"
> & {
  activeFilterValues: MaybeReviewedTitleFiltersValues;
  pendingFilterValues: MaybeReviewedTitleFiltersValues;
};

export type MaybeReviewedTitleFiltersValues = TitleFiltersValues & {
  gradeValue?: [number, number];
  reviewedStatus?: string;
  reviewYear?: [string, string];
};

type GradeFilterChangedAction = {
  type: "maybeReviewedTitleFilters/gradeFilterChanged";
  values: [number, number];
};

type ReviewedStatusFilterChangedAction = {
  type: "maybeReviewedTitleFilters/reviewedStatusFilterChanged";
  value: string;
};

type ReviewYearFilterChangedAction = {
  type: "maybeReviewedTitleFilters/reviewYearFilterChanged";
  values: [string, string];
};

export function createGradeFilterChangedAction(
  values: [number, number],
): GradeFilterChangedAction {
  return { type: "maybeReviewedTitleFilters/gradeFilterChanged", values };
}

export function createInitialMaybeReviewedTitleFiltersState<
  TValue extends FilterableMaybeReviewedTitle,
>({ values }: { values: TValue[] }): MaybeReviewedTitleFiltersState<TValue> {
  const titleFilterState = createInitialTitleFiltersState({
    values,
  });

  return {
    ...titleFilterState,
    activeFilterValues: {},
    pendingFilterValues: {},
  };
}

export function createReviewedStatusFilterChangedAction(
  value: string,
): ReviewedStatusFilterChangedAction {
  return {
    type: "maybeReviewedTitleFilters/reviewedStatusFilterChanged",
    value,
  };
}

export function createReviewYearFilterChangedAction(
  values: [string, string],
): ReviewYearFilterChangedAction {
  return { type: "maybeReviewedTitleFilters/reviewYearFilterChanged", values };
}

// Create reducer function
export function maybeReviewedTitleFiltersReducer<
  TValue extends FilterableMaybeReviewedTitle,
  TState extends MaybeReviewedTitleFiltersState<TValue>,
>(state: TState, action: MaybeReviewedTitleFiltersAction): TState {
  switch (action.type) {
    // Field-specific shared filters
    case "maybeReviewedTitleFilters/gradeFilterChanged": {
      return handleGradeFilterChanged<TValue, TState>(state, action);
    }

    case "maybeReviewedTitleFilters/reviewedStatusFilterChanged": {
      return handleReviewedStatusFilterChanged<TValue, TState>(state, action);
    }
    case "maybeReviewedTitleFilters/reviewYearFilterChanged": {
      return handleReviewYearFilterChanged<TValue, TState>(state, action);
    }

    default: {
      return titleFiltersReducer<TValue, TState>(state, action);
    }
  }
}

function handleGradeFilterChanged<
  TValue extends FilterableMaybeReviewedTitle,
  TState extends MaybeReviewedTitleFiltersState<TValue>,
>(state: TState, action: GradeFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      gradeValue: action.values,
    },
  };
}

function handleReviewedStatusFilterChanged<
  TValue extends FilterableMaybeReviewedTitle,
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

function handleReviewYearFilterChanged<
  TValue extends FilterableMaybeReviewedTitle,
  TState extends MaybeReviewedTitleFiltersState<TValue>,
>(state: TState, action: ReviewYearFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      reviewYear: action.values,
    },
  };
}
