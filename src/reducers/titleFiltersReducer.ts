import type {
  FiltersAction,
  FiltersState,
  RemoveAppliedFilterAction,
} from "./filtersReducer";

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
    // AIDEV-NOTE: Override removeAppliedFilter for genre filters
    // Genre chips have IDs like "genre-horror" but need to remove from genres array
    case "filters/removeAppliedFilter": {
      return handleRemoveAppliedFilter<TValue, TState>(state, action);
    }

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
 * Handle removing applied filters - special case for genre filters
 * AIDEV-NOTE: Genre chips have IDs like "genre-horror" but we need to remove
 * that specific genre from the genres array, not delete the whole genres key.
 * Updates BOTH pendingFilterValues and activeFilterValues to ensure UI updates.
 */
function handleRemoveAppliedFilter<
  TValue,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: RemoveAppliedFilterAction): TState {
  // Handle genre filters which have IDs like "genre-horror"
  if (action.filterKey.startsWith("genre-")) {
    const genreToRemove = action.filterKey
      .replace("genre-", "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const currentGenres = state.pendingFilterValues.genres;
    if (Array.isArray(currentGenres)) {
      const updatedGenres = currentGenres.filter(
        (g) =>
          String(g).toLowerCase().replaceAll(" ", "-") !==
          genreToRemove.toLowerCase().replaceAll(" ", "-"),
      );

      // If no genres left, remove the genres key entirely from both pending and active
      if (updatedGenres.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { genres: _removedPending, ...remainingPendingFilters } =
          state.pendingFilterValues;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { genres: _removedActive, ...remainingActiveFilters } =
          state.activeFilterValues;
        return {
          ...state,
          activeFilterValues: remainingActiveFilters,
          pendingFilterValues: remainingPendingFilters,
        };
      }

      // Update both pending and active filter values
      return {
        ...state,
        activeFilterValues: {
          ...state.activeFilterValues,
          genres: updatedGenres,
        },
        pendingFilterValues: {
          ...state.pendingFilterValues,
          genres: updatedGenres,
        },
      };
    }
  }

  // For other filters (title, releaseYear), delegate to base filtersReducer
  return filtersReducer<TValue, TState>(state, action);
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
