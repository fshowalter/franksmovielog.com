import type { FiltersActionType, FiltersState } from "./filters.reducer";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSortActionCreator,
  updatePendingFilter,
} from "./filters.reducer";

import type { TitleFilterValues } from "./titlesReducerUtils";

import {
  createFiltersReducer,
  createInitialFiltersState,
  updatePendingFilter,
} from "./filters.reducer";

/**
 * Work-specific action types
 */
enum TitleFiltersActions {
  Set_Genres_Pending_Filter = "titleFilters/setGenresPendingFilter",
  Set_Release_Year_Pending_Filter = "titleFilters/setReleaseYearPendingFilter",
  Set_Title_Pending_Filter = "titleFilters/setTitlePendingFilter",
}

export type FilterableTitle = {
  genres: string[];
  releaseYear: string;
  title: string;
};

/**
 * Union type of all title-specific filter actions
 */
export type TitleFiltersActionType<TSort> =
  | FiltersActionType<TSort>
  | SetGenresPendingFilterAction
  | SetReleaseYearPendingFilterAction
  | SetTitlePendingFilterAction;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type TitleFiltersState<TValue extends FilterableTitle, TSort> = Omit<
  FiltersState<TValue, TSort>,
  "filterValues" | "pendingFilterValues"
> & {
  filterValues: TitleFiltersValues;
  pendingFilterValues: TitleFiltersValues;
};

/**
 * Type for title filter values with known keys
 */
export type TitleFiltersValues = {
  genres?: readonly string[];
  releaseYear?: [string, string];
  title?: string;
};

type SetGenresPendingFilterAction = {
  type: TitleFiltersActions.Set_Genres_Pending_Filter;
  values: readonly string[];
};

type SetReleaseYearPendingFilterAction = {
  type: TitleFiltersActions.Set_Release_Year_Pending_Filter;
  values: [string, string];
};

type SetTitlePendingFilterAction = {
  type: TitleFiltersActions.Set_Title_Pending_Filter;
  value: string;
};

export function createInitialTitleFiltersState<
  TValue extends FilterableTitle,
  TSort,
>({
  initialSort,
  values,
}: {
  initialSort: TSort;
  values: TValue[];
}): TitleFiltersState<TValue, TSort> {
  const filterState = createInitialFiltersState({ initialSort, values });
  return {
    ...filterState,
  };
}

export function createSetGenresPendingFilterAction(
  values: readonly string[],
): SetGenresPendingFilterAction {
  return { type: TitleFiltersActions.Set_Genres_Pending_Filter, values };
}

export function createSetReleaseYearPendingFilterAction(
  values: [string, string],
): SetReleaseYearPendingFilterAction {
  return { type: TitleFiltersActions.Set_Release_Year_Pending_Filter, values };
}

export function createSetTitlePendingFilterAction(
  value: string,
): SetTitlePendingFilterAction {
  return { type: TitleFiltersActions.Set_Title_Pending_Filter, value };
}

// Create reducer function
export function createTitleFiltersReducer<
  TValue extends FilterableTitle,
  TSort,
  TState extends TitleFiltersState<TValue, TSort>,
>() {
  const filterReducer = createFiltersReducer<TValue, TSort, TState>();

  return function reducer(
    state: TState,
    action: TitleFiltersActionType<TSort>,
  ): TState {
    switch (action.type) {
      // Field-specific shared filters
      case TitleFiltersActions.Set_Genres_Pending_Filter: {
        return handleSetGenresPendingFilterAction<TValue, TSort, TState>(
          state,
          action,
        );
      }

      case TitleFiltersActions.Set_Release_Year_Pending_Filter: {
        return handleSetReleaseYearPendingFilterAction<TValue, TSort, TState>(
          state,
          action,
        );
      }

      case TitleFiltersActions.Set_Title_Pending_Filter: {
        return handleSetTitlePendingFilterAction<TValue, TSort, TState>(
          state,
          action,
        );
      }
      default: {
        return filterReducer(state, action);
      }
    }
  };
}

/**
 * Create a Genre filter function
 */
function createGenresFilter<TValue extends FilterableTitle>(
  genres: readonly string[],
) {
  if (genres.length === 0) return;
  return (value: TValue) => {
    return genres.every((genre) => value.genres.includes(genre));
  };
}

/**
 * Create a Release Year filter function
 */
function createReleaseYearFilter<TValue extends FilterableTitle>(
  minYear: string,
  maxYear: string,
) {
  return (value: TValue): boolean => {
    return value.releaseYear >= minYear && value.releaseYear <= maxYear;
  };
}

/**
 * Create a Title filter function
 */
function createTitleFilter<TValue extends FilterableTitle>(
  value: string | undefined,
) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return (value: TValue): boolean => regex.test(value.title);
}

/**
 * Handle Genre filter action
 */
function handleSetGenresPendingFilterAction<
  TValue extends FilterableTitle,
  TSort,
  TState extends TitleFiltersState<TValue, TSort>,
>(state: TState, action: SetGenresPendingFilterAction): TState {
  const filterFn = createGenresFilter<TValue>(action.values);
  const filterKey: keyof TitleFiltersValues = "genres";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.values,
  );
}

/**
 * Handle Release Year filter action
 */
function handleSetReleaseYearPendingFilterAction<
  TValue extends FilterableTitle,
  TSort,
  TState extends TitleFiltersState<TValue, TSort>,
>(state: TState, action: SetReleaseYearPendingFilterAction): TState {
  const filterFn = createReleaseYearFilter<TValue>(
    action.values[0],
    action.values[1],
  );
  const filterKey: keyof TitleFilterValues = "releaseYear";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.values,
  );
}

/**
 * Handle Title filter action
 */
function handleSetTitlePendingFilterAction<
  TValue extends FilterableTitle,
  TSort,
  TState extends TitleFiltersState<TValue, TSort>,
>(state: TState, action: SetTitlePendingFilterAction): TState {
  const filterFn = createTitleFilter<TValue>(action.value);
  const filterKey: keyof TitleFiltersValues = "title";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.value,
  );
}
