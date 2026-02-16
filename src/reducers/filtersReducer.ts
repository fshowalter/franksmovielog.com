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
 * Remove a specific filter from both pending and active filters
 * AIDEV-NOTE: Removes from both pending and active to provide immediate feedback
 * when user explicitly removes a filter via chip click
 *
 * AIDEV-NOTE: Child reducers often override this behavior for domain-specific handling.
 * Common scenarios that require overriding:
 *
 * 1. Array-valued filters (genres, medium, venue, etc.):
 *    - Base implementation removes entire filter key
 *    - But chips like "genre-horror" need to remove single value from genres array
 *    - Child must extract value from filterKey and filter the array
 *
 * 2. Multi-select filters with kebab-case IDs:
 *    - Chip IDs like "medium-blu-ray" need conversion to "Blu Ray"
 *    - Then remove from array while preserving other values
 *
 * CRITICAL: When overriding, child reducers MUST:
 * - Update BOTH activeFilterValues AND pendingFilterValues
 * - Otherwise UI won't update immediately when chip is clicked
 * - See titleFiltersReducer.ts, maybeReviewedTitleFiltersReducer.ts,
 *   Viewings.reducer.ts for examples
 */
function removeAppliedFilter<TValue, TState extends FiltersState<TValue>>(
  state: TState,
  action: RemoveAppliedFilterAction,
): TState {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [action.filterKey]: _removedPending, ...remainingPendingFilters } =
    state.pendingFilterValues;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [action.filterKey]: _removedActive, ...remainingActiveFilters } =
    state.activeFilterValues;

  return {
    ...state,
    activeFilterValues: remainingActiveFilters,
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
