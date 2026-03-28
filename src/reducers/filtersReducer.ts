/**
 * Union type for all filter-related actions.
 */
export type FiltersAction =
  | ApplyFiltersAction
  | ClearFiltersAction
  | RemoveAppliedFilterAction
  | ResetFiltersAction;

export type RemoveAppliedFilterAction = {
  filterKey: string;
  type: "filters/removeAppliedFilter";
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

/**
 * State shape for filter functionality.
 */
type FiltersState<TValue> = {
  activeFilterValues: Record<string, unknown>;
  pendingFilterValues: Record<string, unknown>;
  values: TValue[];
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
 * Lifecycle reducer for filter state: apply, clear, reset, and scalar chip removal.
 * Accepts any action; handles its own types and returns state unchanged for others.
 * @param state - Current filter state
 * @param action - Action to process
 * @returns Updated state with filter changes applied
 */
export function filtersLifecycleReducer<
  TValue,
  TState extends FiltersState<TValue>,
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/applied": {
      return applyFilters<TValue, TState>(state);
    }

    case "filters/cleared": {
      return clearFilters<TValue, TState>(state);
    }

    case "filters/removeAppliedFilter": {
      return removeAppliedFilter<TValue, TState>(
        state,
        action as RemoveAppliedFilterAction,
      );
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
 * Clear all filters (both pending and active)
 * AIDEV-NOTE: Clears both pending and active to provide immediate feedback
 * when user explicitly clears filters via "Clear all" button
 */
function clearFilters<TValue, TState extends FiltersState<TValue>>(
  state: TState,
): TState {
  return {
    ...state,
    activeFilterValues: {},
    pendingFilterValues: {},
  };
}

/**
 * Remove a specific filter from pending filters only (deferred).
 * AIDEV-NOTE: Only updates pendingFilterValues — list update is deferred until
 * "View Results" is clicked (which triggers filters/applied). This matches the
 * facet pattern where chip removal is always deferred.
 *
 * Array-valued facets (genres, reviewedStatus, creditedAs, etc.) handle their
 * own chip IDs (e.g. "genre-horror") in their respective facet reducers.
 * This base handler covers scalar filters where filterKey exactly matches a
 * pendingFilterValues key (e.g. "title", "gradeValue", "releaseYear").
 */
function removeAppliedFilter<TValue, TState extends FiltersState<TValue>>(
  state: TState,
  action: RemoveAppliedFilterAction,
): TState {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [action.filterKey]: _removedPending, ...remainingPendingFilters } =
    state.pendingFilterValues;

  return {
    ...state,
    pendingFilterValues: remainingPendingFilters,
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
