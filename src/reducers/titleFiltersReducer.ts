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
  | GenresChangedAction
  | ReleaseYearChangedAction
  | TitleChangedAction;

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

type GenresChangedAction = {
  type: "titleFilters/genresChanged";
  values: readonly string[];
};

type ReleaseYearChangedAction = {
  type: "titleFilters/releaseYearChanged";
  values: [string, string];
};

type TitleChangedAction = {
  type: "titleFilters/titleChanged";
  value: string;
};

export function createGenresUpdatedAction(
  values: readonly string[],
): GenresChangedAction {
  return { type: "titleFilters/genresChanged", values };
}

export function createInitialTitleFiltersState<TValue extends FilterableTitle>({
  values,
}: {
  values: TValue[];
}): TitleFiltersState<TValue> {
  const filterState = createInitialFiltersState({
    values,
  });

  return {
    ...filterState,
  };
}

export function createReleaseYearUpdatedAction(
  values: [string, string],
): ReleaseYearChangedAction {
  return { type: "titleFilters/releaseYearChanged", values };
}

export function createTitleUpdatedAction(value: string): TitleChangedAction {
  return { type: "titleFilters/titleChanged", value };
}

// Create reducer function
export function titleFiltersReducer<
  TValue extends FilterableTitle,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: TitleFiltersAction): TState {
  switch (action.type) {
    // Field-specific shared filters
    case "titleFilters/genresChanged": {
      return handleGenresChanged<TValue, TState>(state, action);
    }

    case "titleFilters/releaseYearChanged": {
      return handleReleaseYearChanged<TValue, TState>(state, action);
    }

    case "titleFilters/titleChanged": {
      return handleTitleChanged<TValue, TState>(state, action);
    }
    default: {
      return filtersReducer<TValue, TState>(state, action);
    }
  }
}

/**
 * Handle Genre filter action
 */
function handleGenresChanged<
  TValue extends FilterableTitle,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: GenresChangedAction): TState {
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
function handleReleaseYearChanged<
  TValue extends FilterableTitle,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: ReleaseYearChangedAction): TState {
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
function handleTitleChanged<
  TValue extends FilterableTitle,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: TitleChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      title: action.value,
    },
  };
}
