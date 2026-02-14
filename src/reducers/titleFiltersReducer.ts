import type { FiltersAction, FiltersState } from "./filtersReducer";

export type { RemoveAppliedFilterAction } from "./filtersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  selectHasPendingFilters,
} from "./filtersReducer";

import { createInitialFiltersState, filtersReducer } from "./filtersReducer";

/**
 * Union type of all title-specific filter actions
 */
export type TitleFiltersAction =
  | FiltersAction
  | GenresFilterChangedAction
  | ReleaseYearFilterChangedAction
  | TitleFilterChangedAction;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type TitleFiltersState<TValue> = Omit<
  FiltersState<TValue>,
  "activeFilterValues" | "pendingFilterValues"
> & {
  activeFilterValues: TitleFiltersValues;
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

type GenresFilterChangedAction = {
  type: "titleFilters/genresFilterChanged";
  values: readonly string[];
};

type ReleaseYearFilterChangedAction = {
  type: "titleFilters/releaseYearFilterChanged";
  values: [string, string];
};

type TitleFilterChangedAction = {
  type: "titleFilters/titleFilterChanged";
  value: string;
};

/**
 * Creates an action for changing the genres filter.
 * @param values - Array of genre names to filter by
 * @returns Genres filter changed action
 */
export function createGenresFilterChangedAction(
  values: readonly string[],
): GenresFilterChangedAction {
  return { type: "titleFilters/genresFilterChanged", values };
}

/**
 * Creates the initial state for title filters.
 * @param options - Configuration object
 * @param options.values - Array of values to be filtered
 * @returns Initial title filters state
 */
export function createInitialTitleFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): TitleFiltersState<TValue> {
  const filterState = createInitialFiltersState({
    values,
  });

  return filterState;
}

/**
 * Creates an action for changing the release year range filter.
 * @param values - Tuple of [startYear, endYear] as strings
 * @returns Release year filter changed action
 */
export function createReleaseYearFilterChangedAction(
  values: [string, string],
): ReleaseYearFilterChangedAction {
  return { type: "titleFilters/releaseYearFilterChanged", values };
}

/**
 * Creates an action for changing the title search filter.
 * @param value - Search string to filter titles by
 * @returns Title filter changed action
 */
export function createTitleFilterChangedAction(
  value: string,
): TitleFilterChangedAction {
  return { type: "titleFilters/titleFilterChanged", value };
}

/**
 * Reducer function for handling title filter state updates.
 * @param state - Current title filters state
 * @param action - Title filter action to process
 * @returns Updated state with filter changes applied
 */
export function titleFiltersReducer<
  TValue,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: TitleFiltersAction): TState {
  switch (action.type) {
    case "titleFilters/genresFilterChanged": {
      return handleGenresFilterChanged<TValue, TState>(state, action);
    }

    case "titleFilters/releaseYearFilterChanged": {
      return handleReleaseYearFilterChanged<TValue, TState>(state, action);
    }

    case "titleFilters/titleFilterChanged": {
      return handleTitleFilterChanged<TValue, TState>(state, action);
    }
    default: {
      return filtersReducer<TValue, TState>(state, action);
    }
  }
}

/**
 * Handle Genre filter action
 */
function handleGenresFilterChanged<
  TValue,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: GenresFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      genres: action.values,
    },
  };
}

/**
 * Handle Release Year filter action
 */
function handleReleaseYearFilterChanged<
  TValue,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: ReleaseYearFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      releaseYear: action.values,
    },
  };
}

/**
 * Handle Title filter action
 */
function handleTitleFilterChanged<
  TValue,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: TitleFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      title: action.value,
    },
  };
}
