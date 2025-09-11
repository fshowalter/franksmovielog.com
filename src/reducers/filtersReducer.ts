export enum FiltersActions {
  Apply_Pending_Filters = "filters/applyPendingFilters",
  Clear_Pending_Filters = "filters/clearPendingFilters",
  Reset_Pending_Filters = "filters/resetPendingFilters",
}

export type FiltersActionType =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | ResetPendingFiltersAction;

export type FiltersState<TValue> = {
  filters: Record<string, (value: TValue) => boolean>;
  filterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw filter values for UI
  pendingFilters: Record<string, (value: TValue) => boolean>;
  values: TValue[];
};

/**
 * Base Action Type Definitions
 */
type ApplyPendingFiltersAction = {
  type: FiltersActions.Apply_Pending_Filters;
};

type ClearPendingFiltersAction = {
  type: FiltersActions.Clear_Pending_Filters;
};

type ResetPendingFiltersAction = {
  type: FiltersActions.Reset_Pending_Filters;
};

export function createApplyPendingFiltersAction(): ApplyPendingFiltersAction {
  return { type: FiltersActions.Apply_Pending_Filters };
}

export function createClearPendingFiltersAction(): ClearPendingFiltersAction {
  return { type: FiltersActions.Clear_Pending_Filters };
}

export function createInitialFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): FiltersState<TValue> {
  return {
    filters: {},
    filterValues: {},
    pendingFilters: {},
    values,
  };
}

export function createResetPendingFiltersAction(): ResetPendingFiltersAction {
  return { type: FiltersActions.Reset_Pending_Filters };
}

export function filtersReducer<TValue, TState extends FiltersState<TValue>>(
  state: TState,
  action: FiltersActionType,
): TState {
  switch (action.type) {
    case FiltersActions.Apply_Pending_Filters: {
      return applyPendingFilters<TValue, TState>(state);
    }

    case FiltersActions.Clear_Pending_Filters: {
      return clearPendingFilters<TValue, TState>(state);
    }

    case FiltersActions.Reset_Pending_Filters: {
      return resetPendingFilters<TValue, TState>(state);
    }

    default: {
      return state;
    }
  }
}

/**
 * Update a pending filter
 */
export function updatePendingFilter<
  TValue,
  TState extends FiltersState<TValue>,
>(
  state: TState,
  key: string,
  filterFn: ((value: TValue) => boolean) | undefined,
  value:
    | [number, number]
    | [string, string]
    | readonly string[]
    | string
    | undefined,
): TState {
  const pendingFilters = { ...state.pendingFilters };

  if (filterFn === undefined || value === undefined) {
    delete pendingFilters[key];
  } else {
    pendingFilters[key] = filterFn;
  }

  return {
    ...state,
    pendingFilters,
  };
}

/**
 * Apply pending filters to become active filters
 */
function applyPendingFilters<TValue, TState extends FiltersState<TValue>>(
  state: TState,
): TState {
  return {
    ...state,
    filters: { ...state.pendingFilters },
  };
}

/**
 * Clear all pending filters
 */
function clearPendingFilters<TValue, TState extends FiltersState<TValue>>(
  state: TState,
): TState {
  return {
    ...state,
    pendingFilters: {},
  };
}

/**
 * Reset pending filters to current active filters
 */
function resetPendingFilters<TValue, TState extends FiltersState<TValue>>(
  state: TState,
): TState {
  return {
    ...state,
    pendingFilters: { ...state.filters },
  };
}
