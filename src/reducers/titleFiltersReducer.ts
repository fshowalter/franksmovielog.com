import type { FiltersAction, FiltersState } from "./filtersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createResetFiltersAction,
} from "./filtersReducer";

import { createInitialFiltersState, filtersReducer } from "./filtersReducer";

export type FilterableTitle = {
  genres: string[];
  releaseYear: string;
  title: string;
};

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
export type TitleFiltersState<TValue extends FilterableTitle> = Omit<
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

export function createGenresFilterChangedAction(
  values: readonly string[],
): GenresFilterChangedAction {
  return { type: "titleFilters/genresFilterChanged", values };
}

export function createInitialTitleFiltersState<TValue extends FilterableTitle>({
  values,
}: {
  values: TValue[];
}): TitleFiltersState<TValue> {
  const filterState = createInitialFiltersState({
    values,
  });

  return filterState;
}

export function createReleaseYearFilterChangedAction(
  values: [string, string],
): ReleaseYearFilterChangedAction {
  return { type: "titleFilters/releaseYearFilterChanged", values };
}

export function createTitleFilterChangedAction(
  value: string,
): TitleFilterChangedAction {
  return { type: "titleFilters/titleFilterChanged", value };
}

// Create reducer function
export function titleFiltersReducer<
  TValue extends FilterableTitle,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: TitleFiltersAction): TState {
  switch (action.type) {
    // Field-specific shared filters
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
  TValue extends FilterableTitle,
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
  TValue extends FilterableTitle,
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
  TValue extends FilterableTitle,
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
