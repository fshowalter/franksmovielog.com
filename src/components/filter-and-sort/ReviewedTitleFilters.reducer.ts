import type { ShowMoreAction, ShowMoreState } from "./showMore.reducer";
import type { Sorter } from "./TitleFilters.reducer";
import type { FilterableTitle, TitleFiltersActionType, TitleFiltersState, TitleFiltersValues } from "./TitleFilters.reducer";

import { updatePendingFilter } from "./createFiltersReducer";
import { createInitialShowMoreState, ShowMoreActions, showMoreReducer } from "./showMore.reducer";
import { createInitialTitleFiltersState, createTitleFiltersReducer } from "./TitleFilters.reducer";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetGenresPendingFilterAction,
  createSetReleaseYearPendingFilterAction,
  createSetTitlePendingFilterAction,
  createSortActionCreator,
} from "./TitleFilters.reducer";

/**
 * Title-specific action types
 */
enum ReviewedTitleFiltersActions {
  Set_Grade_Pending_Filter = "reviewedTitleFilters/setGradePendingFilter",
  Set_Review_Year_Pending_Filter = "reviewedTitleFilters/setReviewYearPendingFilter",
}

/**
 * Union type of all reviewed Title-specific filter actions
 */
export type ReviewedTitleFiltersActionType<TSort> =
  | SetGradePendingFilterAction
  | SetReviewYearPendingFilterAction
  | ShowMoreAction
  | TitleFiltersActionType<TSort>;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type ReviewedTitleFiltersState<
  TValue extends FilterableReviewedTitle,
  TSort,
> = Omit<
  TitleFiltersState<TValue, TSort>,
  "filterValues" | "pendingFilterValues"
> &
  ShowMoreState & {
    filterValues: ReviewedTitleFiltersValues;
    pendingFilterValues: ReviewedTitleFiltersValues;
  };

/**
 * Type for title filter values with known keys
 */
export type ReviewedTitleFiltersValues = TitleFiltersValues & {
  gradeValue?: [number, number];
  reviewYear?: [string, string];
};

type FilterableReviewedTitle = FilterableTitle & {
  gradeValue: number;
  reviewYear: string;
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
>({ sorter }: { sorter: Sorter<TValue, TSort> }) {
  const TitleFiltersReducer = createTitleFiltersReducer<TValue, TSort, TState>({
    sorter,
  });

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
