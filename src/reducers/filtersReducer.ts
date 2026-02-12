/**
 * Union type for all filter-related actions.
 */
export type FiltersAction =
  | ApplyFiltersAction
  | ClearFiltersAction
  | RemoveAppliedFilterAction
  | ResetFiltersAction;

/**
 * State shape for filter functionality.
 */
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

export type RemoveAppliedFilterAction = {
  filterKey: string;
  type: "filters/removeAppliedFilter";
};

type ResetFiltersAction = {
  type: "filters/reset";
};

/**
 * Creates an action to apply pending filters to active state.
 * @returns Apply filters action
 */
export function createApplyFiltersAction(): ApplyFiltersAction {
  return { type: "filters/applied" };
}

/**
 * Creates an action to clear all pending filters.
 * @returns Clear filters action
 */
export function createClearFiltersAction(): ClearFiltersAction {
  return { type: "filters/cleared" };
}

/**
 * Creates the initial state for filter functionality.
 * @param options - Configuration object
 * @param options.values - Array of values to be filtered
 * @returns Initial filters state with empty filter values
 */
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

/**
 * Creates an action to remove a specific filter from pending filters.
 * @param filterKey - The key of the filter to remove (e.g., "genres", "gradeValue", "title")
 * @returns Remove applied filter action
 */
export function createRemoveAppliedFilterAction(
  filterKey: string,
): RemoveAppliedFilterAction {
  return { filterKey, type: "filters/removeAppliedFilter" };
}

/**
 * Creates an action to reset filters to initial state.
 * @returns Reset filters action
 */
export function createResetFiltersAction(): ResetFiltersAction {
  return { type: "filters/reset" };
}

/**
 * Reducer function for handling filter state updates.
 * @param state - Current filter state
 * @param action - Filter action to process
 * @returns Updated state with filter changes applied
 */
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

    case "filters/removeAppliedFilter": {
      return removeAppliedFilter<TValue, TState>(state, action);
    }

    case "filters/reset": {
      return resetFilters<TValue, TState>(state);
    }
  }
}

/**
 * Selector to determine if there are any pending filters.
 * @param state - Current filter state
 * @returns True if there are pending filters, false otherwise
 */
export function selectHasPendingFilters<
  TValue,
  TState extends FiltersState<TValue>,
>(state: TState): boolean {
  return Object.keys(state.pendingFilterValues).length > 0;
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
    pendingFilterValues: {},
  };
}

/**
 * Remove a specific filter from pending filters
 */
function removeAppliedFilter<TValue, TState extends FiltersState<TValue>>(
  state: TState,
  action: RemoveAppliedFilterAction,
): TState {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [action.filterKey]: _removed, ...remainingFilters } =
    state.pendingFilterValues;

  return {
    ...state,
    pendingFilterValues: remainingFilters,
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
    activeFilterValues: state.activeFilterValues,
    pendingFilterValues: { ...state.activeFilterValues },
  };
}
