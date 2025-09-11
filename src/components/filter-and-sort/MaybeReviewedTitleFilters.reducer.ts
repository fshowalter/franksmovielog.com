import { updatePendingFilter } from "./createFiltersReducer";
import {
  createInitialShowMoreState,
  type ShowMoreAction,
  ShowMoreActions,
  showMoreReducer,
  type ShowMoreState,
} from "./showMore.reducer";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetGenresPendingFilterAction,
  createSetReleaseYearPendingFilterAction,
  createSetTitlePendingFilterAction,
  createSortActionCreator,
} from "./ReviewedTitleFilters.reducer";

enum MaybeReviewedTitleFiltersActions {
  Set_Review_Status_Pending_Filter = "maybeReviewedTitleFilters/setReviewStatusPendingFilter",
}

export type MaybeReviewedTitleFiltersActionType<TSort> =
  | ReviewedTitleFiltersActionType<TSort>
  | SetReviewStatusPendingFilterAction;

export type MaybeReviewedTitleFiltersState<
  TValue extends FilterableMaybeReviewedTitle,
  TSort,
> = Omit<
  ReviewedTitleFiltersState<TValue, TSort>,
  "filterValues" | "pendingFilterValues"
> &
  ShowMoreState & {
    filterValues: MaybeReviewedTitleFiltersValues;
    pendingFilterValues: MaybeReviewedTitleFiltersValues;
  };

/**
 * Type for title filter values with known keys
 */
export type MaybeReviewedTitleFiltersValues = ReviewedTitleFiltersValues & {
  reviewStatus?: string;
};

type FilterableMaybeReviewedTitle = FilterableReviewedTitle & {
  slug?: string;
};

type SetGradePendingFilterAction = {
  type: ReviewedTitleFiltersActions.Set_Grade_Pending_Filter;
  values: [number, number];
};

type SetReviewYearPendingFilterAction = {
  type: ReviewedTitleFiltersActions.Set_Review_Year_Pending_Filter;
  values: [string, string];
};

export function createInitialReviewedTitleFiltersState<
  TValue extends FilterableReviewedTitle,
  TSort,
>({
  initialSort,
  values,
}: {
  initialSort: TSort;
  values: TValue[];
}): ReviewedTitleFiltersState<TValue, TSort> {
  const filterState = createInitialTitleFiltersState({ initialSort, values });
  const showMoreState = createInitialShowMoreState();
  return {
    ...filterState,
    ...showMoreState,
  };
}

// Create reducer function
export function createReviewedTitleFiltersReducer<
  TValue extends FilterableReviewedTitle,
  TSort,
  TState extends ReviewedTitleFiltersState<TValue, TSort>,
>() {
  const TitleFiltersReducer = createTitleFiltersReducer<
    TValue,
    TSort,
    TState
  >();

  return function reducer(
    state: TState,
    action: ReviewedTitleFiltersActionType<TSort>,
  ): TState {
    switch (action.type) {
      // Field-specific shared filters
      case ReviewedTitleFiltersActions.Set_Grade_Pending_Filter: {
        return handleSetGradePendingFilterAction<TValue, TSort, TState>(
          state,
          action,
        );
      }

      case ReviewedTitleFiltersActions.Set_Review_Year_Pending_Filter: {
        return handleSetReviewYearPendingFilterAction<TValue, TSort, TState>(
          state,
          action,
        );
      }

      case ShowMoreActions.Show_More: {
        return showMoreReducer(state, action);
      }

      default: {
        return TitleFiltersReducer(state, action);
      }
    }
  };
}

export function createSetGradePendingFilterAction(
  values: [number, number],
): SetGradePendingFilterAction {
  return { type: ReviewedTitleFiltersActions.Set_Grade_Pending_Filter, values };
}

export function createSetReviewYearPendingFilterAction(
  values: [string, string],
): SetReviewYearPendingFilterAction {
  return {
    type: ReviewedTitleFiltersActions.Set_Review_Year_Pending_Filter,
    values,
  };
}

/**
 * Create a Grade filter function
 */
function createGradeFilter<TValue extends FilterableReviewedTitle>(
  minGradeValue: number,
  maxGradeValue: number,
) {
  return (item: TValue) => {
    return item.gradeValue >= minGradeValue && item.gradeValue <= maxGradeValue;
  };
}

/**
 * Create a Review Year filter function
 */
function createReviewYearFilter<TValue extends FilterableReviewedTitle>(
  minYear: string,
  maxYear: string,
) {
  return (item: TValue) => {
    const year = item.reviewYear;
    return year >= minYear && year <= maxYear;
  };
}

/**
 * Handle Grade filter action
 */
function handleSetGradePendingFilterAction<
  TValue extends FilterableReviewedTitle,
  TSort,
  TState extends ReviewedTitleFiltersState<TValue, TSort>,
>(state: TState, action: SetGradePendingFilterAction): TState {
  const filterFn = createGradeFilter<TValue>(
    action.values[0],
    action.values[1],
  );
  const filterKey: keyof ReviewedTitleFiltersValues = "gradeValue";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.values,
  );
}

/**
 * Handle Review Year filter action
 */
function handleSetReviewYearPendingFilterAction<
  TValue extends FilterableReviewedTitle,
  TSort,
  TState extends ReviewedTitleFiltersState<TValue, TSort>,
>(state: TState, action: SetReviewYearPendingFilterAction): TState {
  const filterFn = createReviewYearFilter<TValue>(
    action.values[0],
    action.values[1],
  );
  const filterKey: keyof ReviewedTitleFiltersValues = "reviewYear";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.values,
  );
}
