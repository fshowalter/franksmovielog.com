export type FiltersAction =
  | ApplyFiltersAction
  | ClearFiltersAction
  | ResetFiltersAction;

export type FiltersState<TValue> = {
  activeFilterValues: Record<string, unknown>;
  pendingFilterValues: Record<string, unknown>;
  values: TValue[];
};

/**
 * Base Action Type Definitions
 */
type ApplyFiltersAction = {
  type: "filters/applied";
};

type ClearFiltersAction = {
  type: "filters/cleared";
};

type ResetFiltersAction = {
  type: "filters/reset";
};

export function createApplyFiltersAction(): ApplyFiltersAction {
  return { type: "filters/applied" };
}

export function createClearFiltersAction(): ClearFiltersAction {
  return { type: "filters/cleared" };
}

export function createInitialFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): FiltersState<TValue> {
  return {
    activeFilterValues: {},
    pendingFilterValues: {},
    values,
  };
}

export function createResetFiltersAction(): ResetFiltersAction {
  return { type: "filters/reset" };
}

export function filtersReducer<TValue, TState extends FiltersState<TValue>>(
  state: TState,
  action: FiltersAction,
): TState {
  switch (action.type) {
    case "filters/applied": {
      return applyFilters<TValue, TState>(state);
    }

    case "filters/cleared": {
      return clearFilters<TValue, TState>(state);
    }

    case "filters/reset": {
      return resetFilters<TValue, TState>(state);
    }

    default: {
      return state;
    }
  }
}

/**
 * Apply pending filters to become active filters
 */
function applyFilters<TValue, TState extends FiltersState<TValue>>(
  state: TState,
): TState {
  return {
    ...state,
    activeFilterValues: { ...state.pendingFilterValues },
  };
}

/**
 * Clear all pending filters
 */
function clearFilters<TValue, TState extends FiltersState<TValue>>(
  state: TState,
): TState {
  return {
    ...state,
    filterValues: {},
  };
}

/**
 * Reset pending filters to current active filters
 */
function resetFilters<TValue, TState extends FiltersState<TValue>>(
  state: TState,
): TState {
  return {
    ...state,
    pendingFilterValues: { ...state.activeFilterValues },
  };
}
