export enum FiltersActions {
  Apply_Pending_Filters = "filters/applyPendingFilters",
  Clear_Pending_Filters = "filters/clearPendingFilters",
  Reset_Pending_Filters = "filters/resetPendingFilters",
  Sort = "filters/sort",
}

export type FiltersActionType<TSort> =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | ResetPendingFiltersAction
  | SortAction<TSort>;

export type FiltersState<TValue, TSort> = {
  filters: Record<string, (value: TValue) => boolean>;
  filterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw filter values for UI
  pendingFilters: Record<string, (value: TValue) => boolean>;
  sort: TSort;
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

type SortAction<TSort> = {
  type: FiltersActions.Sort;
  value: TSort;
};

export function createApplyPendingFiltersAction(): ApplyPendingFiltersAction {
  return { type: FiltersActions.Apply_Pending_Filters };
}

export function createClearPendingFiltersAction(): ClearPendingFiltersAction {
  return { type: FiltersActions.Clear_Pending_Filters };
}

export function createFiltersReducer<
  TValue,
  TSort,
  TState extends FiltersState<TValue, TSort>,
>() {
  return function reducer(
    state: TState,
    action: FiltersActionType<TSort>,
  ): TState {
    switch (action.type) {
      case FiltersActions.Apply_Pending_Filters: {
        return applyPendingFilters<TValue, TSort, TState>(state);
      }

      case FiltersActions.Clear_Pending_Filters: {
        return clearPendingFilters<TValue, TSort, TState>(state);
      }

      case FiltersActions.Reset_Pending_Filters: {
        return resetPendingFilters<TValue, TSort, TState>(state);
      }

      case FiltersActions.Sort: {
        return updateSort<TValue, TSort, TState>(state, action);
      }

      default: {
        return state;
      }
    }
  };
}

export function createInitialFiltersState<TValue, TSort>({
  initialSort,
  values,
}: {
  initialSort: TSort;
  values: TValue[];
}): FiltersState<TValue, TSort> {
  return {
    filters: {},
    filterValues: {},
    pendingFilters: {},
    sort: initialSort,
    values,
  };
}

export function createResetPendingFiltersAction(): ResetPendingFiltersAction {
  return { type: FiltersActions.Reset_Pending_Filters };
}

export function createSortActionCreator<TSort>() {
  return function createSortAction(value: TSort): SortAction<TSort> {
    return {
      type: FiltersActions.Sort,
      value,
    };
  };
}

/**
 * Update a pending filter
 */
export function updatePendingFilter<
  TValue,
  TSort,
  TState extends FiltersState<TValue, TSort>,
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
function applyPendingFilters<
  TValue,
  TSort,
  TState extends FiltersState<TValue, TSort>,
>(state: TState): TState {
  return {
    ...state,
    filters: { ...state.pendingFilters },
  };
}

/**
 * Clear all pending filters
 */
function clearPendingFilters<
  TValue,
  TSort,
  TState extends FiltersState<TValue, TSort>,
>(state: TState): TState {
  return {
    ...state,
    pendingFilters: {},
  };
}

/**
 * Reset pending filters to current active filters
 */
function resetPendingFilters<
  TValue,
  TSort,
  TState extends FiltersState<TValue, TSort>,
>(state: TState): TState {
  return {
    ...state,
    pendingFilters: { ...state.filters },
  };
}

function updateSort<TValue, TSort, TState extends FiltersState<TValue, TSort>>(
  state: TState,
  action: SortAction<TSort>,
): TState {
  return {
    ...state,
    sort: action.value,
  };
}
