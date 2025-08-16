/**
 * Filtering system with support for pending filters, grouping, and pagination.
 * This replaces the FilterableState pattern for components that need deferred filter application.
 */

import { filterValues as applyFilters } from "./reducerUtils";

/**
 * Common action types for pending filter reducers
 */
type PendingFilterActions = {
  APPLY_PENDING_FILTERS: "APPLY_PENDING_FILTERS";
  RESET_PENDING_FILTERS: "RESET_PENDING_FILTERS";
  SHOW_MORE: "SHOW_MORE";
  SORT: "SORT";
};

/**
 * State structure for components with pending filters, grouping, and pagination
 */
export type PendingFiltersState<TItem, TSortValue> = {
  allValues: TItem[];
  filteredValues: TItem[];
  filters: Record<string, (item: TItem) => boolean>;
  filterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw filter values for UI
  groupedValues: Map<string, TItem[]>;
  pendingFilteredCount: number;
  pendingFilters: Record<string, (item: TItem) => boolean>;
  pendingFilterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw pending filter values for UI
  showCount: number;
  sortValue: TSortValue;
};

/**
 * Apply pending filters to become active filters
 */
export function applyPendingFilters<TItem, TSortValue>(
  state: PendingFiltersState<TItem, TSortValue>,
  sortFn: (values: TItem[], sort: TSortValue) => TItem[],
  groupFn: (values: TItem[], sort: TSortValue) => Map<string, TItem[]>,
): PendingFiltersState<TItem, TSortValue> {
  const filteredValues = sortFn(
    applyFilters({
      filters: state.pendingFilters,
      values: state.allValues,
    }),
    state.sortValue,
  );

  const groupedValues = groupFn(
    filteredValues.slice(0, state.showCount),
    state.sortValue,
  );

  return {
    ...state,
    filteredValues,
    filters: { ...state.pendingFilters },
    filterValues: { ...state.pendingFilterValues },
    groupedValues,
    pendingFilteredCount: filteredValues.length,
  };
}

/**
 * Build group values helper - groups items by a key function
 */
export function buildGroupValues<TItem, TSortValue>(
  keyFn: (item: TItem, sortValue: TSortValue) => string,
) {
  return function groupValues(
    items: TItem[],
    sortValue: TSortValue,
  ): Map<string, TItem[]> {
    const grouped = new Map<string, TItem[]>();

    for (const item of items) {
      const key = keyFn(item, sortValue);
      const group = grouped.get(key) || [];
      group.push(item);
      grouped.set(key, group);
    }

    return grouped;
  };
}

/**
 * Clear all pending filters
 */
export function clearPendingFilters<TItem, TSortValue>(
  state: PendingFiltersState<TItem, TSortValue>,
): PendingFiltersState<TItem, TSortValue> {
  const pendingFilteredCount = state.allValues.length;

  return {
    ...state,
    pendingFilteredCount,
    pendingFilters: {},
    pendingFilterValues: {},
  };
}

/**
 * Helper to create initial state with pending filters support
 */
export function createInitialState<TItem, TSortValue>({
  groupFn,
  initialSort,
  showCount = 100,
  sortFn,
  values,
}: {
  groupFn: (values: TItem[], sort: TSortValue) => Map<string, TItem[]>;
  initialSort: TSortValue;
  showCount?: number;
  sortFn: (values: TItem[], sort: TSortValue) => TItem[];
  values: TItem[];
}): PendingFiltersState<TItem, TSortValue> {
  const sortedValues = sortFn(values, initialSort);
  const groupedValues = groupFn(sortedValues.slice(0, showCount), initialSort);

  return {
    allValues: values,
    filteredValues: sortedValues,
    filters: {},
    filterValues: {},
    groupedValues,
    pendingFilteredCount: sortedValues.length,
    pendingFilters: {},
    pendingFilterValues: {},
    showCount,
    sortValue: initialSort,
  };
}

/**
 * Reset pending filters to current active filters
 */
export function resetPendingFilters<TItem, TSortValue>(
  state: PendingFiltersState<TItem, TSortValue>,
): PendingFiltersState<TItem, TSortValue> {
  const pendingFilteredCount = applyFilters({
    filters: state.filters,
    values: state.allValues,
  }).length;

  return {
    ...state,
    pendingFilteredCount,
    pendingFilters: { ...state.filters },
    pendingFilterValues: { ...state.filterValues },
  };
}

/**
 * Handle "Show More" pagination
 */
export function showMore<TItem, TSortValue>(
  state: PendingFiltersState<TItem, TSortValue>,
  increment: number,
  groupFn: (values: TItem[], sort: TSortValue) => Map<string, TItem[]>,
): PendingFiltersState<TItem, TSortValue> {
  const showCount = state.showCount + increment;
  const groupedValues = groupFn(
    state.filteredValues.slice(0, showCount),
    state.sortValue,
  );

  return {
    ...state,
    groupedValues,
    showCount,
  };
}

/**
 * Update a pending filter
 */
export function updatePendingFilter<TItem, TSortValue>(
  state: PendingFiltersState<TItem, TSortValue>,
  key: string,
  filterFn: ((item: TItem) => boolean) | undefined,
  value:
    | [number, number]
    | [string, string]
    | readonly string[]
    | string
    | undefined,
): PendingFiltersState<TItem, TSortValue> {
  const pendingFilters = { ...state.pendingFilters };
  const pendingFilterValues = { ...state.pendingFilterValues };

  if (filterFn === undefined || value === undefined) {
    delete pendingFilters[key];
    delete pendingFilterValues[key];
  } else {
    pendingFilters[key] = filterFn;
    pendingFilterValues[key] = value;
  }

  const pendingFilteredCount = applyFilters({
    filters: pendingFilters,
    values: state.allValues,
  }).length;

  return {
    ...state,
    pendingFilteredCount,
    pendingFilters,
    pendingFilterValues,
  };
}

/**
 * Handle sorting
 */
export function updateSort<TItem, TSortValue>(
  state: PendingFiltersState<TItem, TSortValue>,
  sortValue: TSortValue,
  sortFn: (values: TItem[], sort: TSortValue) => TItem[],
  groupFn: (values: TItem[], sort: TSortValue) => Map<string, TItem[]>,
): PendingFiltersState<TItem, TSortValue> {
  const filteredValues = sortFn(state.filteredValues, sortValue);
  const groupedValues = groupFn(
    filteredValues.slice(0, state.showCount),
    sortValue,
  );

  return {
    ...state,
    filteredValues,
    groupedValues,
    sortValue,
  };
}
