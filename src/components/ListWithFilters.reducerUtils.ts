/**
 * Common reducer utilities and filter handlers.
 *
 * These functions provide reusable logic for common reducer patterns
 * like filtering, sorting, and pagination while maintaining full type safety.
 *
 * Uses consistent generic type parameters:
 * - TItem: The type of items in the list
 * - TSortValue: The type of sort values
 * - TGroupedValues: The type of grouped values structure
 */
import { collator } from "~/utils/collator";

/**
 * Common Action Types shared across reducers
 */
export enum ListWithFiltersActions {
  APPLY_PENDING_FILTERS = "APPLY_PENDING_FILTERS",
  CLEAR_PENDING_FILTERS = "CLEAR_PENDING_FILTERS",
  RESET_PENDING_FILTERS = "RESET_PENDING_FILTERS",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
}

/**
 * Common action type definitions
 */
export type ApplyPendingFiltersAction = {
  type: typeof ListWithFiltersActions.APPLY_PENDING_FILTERS;
};

export type ClearPendingFiltersAction = {
  type: typeof ListWithFiltersActions.CLEAR_PENDING_FILTERS;
};

/**
 * State structure for lists with pending filters, grouping, and pagination
 */
export type ListWithFiltersState<TItem, TSortValue> = {
  allValues: TItem[];
  filteredValues: TItem[];
  filters: Record<string, (item: TItem) => boolean>;
  filterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw filter values for UI
  groupedValues: Map<string, TItem[]>;
  hasActiveFilters: boolean;
  pendingFilteredCount: number;
  pendingFilters: Record<string, (item: TItem) => boolean>;
  pendingFilterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw pending filter values for UI
  showCount: number;
  sortValue: TSortValue;
};

export type ResetPendingFiltersAction = {
  type: typeof ListWithFiltersActions.RESET_PENDING_FILTERS;
};

export type ShowMoreAction = {
  type: typeof ListWithFiltersActions.SHOW_MORE;
};

export type SortAction<TSort> = {
  type: typeof ListWithFiltersActions.SORT;
  value: TSort;
};

/**
 * Apply pending filters to become active filters
 */
export function applyPendingFilters<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
  sortFn: (values: TItem[], sort: TSortValue) => TItem[],
  groupFn?: (values: TItem[], sort: TSortValue) => Map<string, TItem[]>,
): ListWithFiltersState<TItem, TSortValue> {
  const filteredValues = sortFn(
    filterValues({
      filters: state.pendingFilters,
      values: state.allValues,
    }),
    state.sortValue,
  );

  const groupedValues = groupFn
    ? groupFn(filteredValues.slice(0, state.showCount), state.sortValue)
    : new Map<string, TItem[]>();

  return {
    ...state,
    filteredValues,
    filters: { ...state.pendingFilters },
    filterValues: { ...state.pendingFilterValues },
    groupedValues,
    hasActiveFilters: Object.keys(state.pendingFilterValues).length > 0,
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
  state: ListWithFiltersState<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> {
  const pendingFilteredCount = state.allValues.length;

  return {
    ...state,
    hasActiveFilters: false,
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
  groupFn?: (values: TItem[], sort: TSortValue) => Map<string, TItem[]>;
  initialSort: TSortValue;
  showCount?: number;
  sortFn: (values: TItem[], sort: TSortValue) => TItem[];
  values: TItem[];
}): ListWithFiltersState<TItem, TSortValue> {
  const sortedValues = sortFn(values, initialSort);
  const groupedValues = groupFn
    ? groupFn(sortedValues.slice(0, showCount), initialSort)
    : new Map<string, TItem[]>();

  return {
    allValues: values,
    filteredValues: sortedValues,
    filters: {},
    filterValues: {},
    groupedValues,
    hasActiveFilters: false,
    pendingFilteredCount: sortedValues.length,
    pendingFilters: {},
    pendingFilterValues: {},
    showCount,
    sortValue: initialSort,
  };
}

export function createNameFilter(value: string | undefined) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return <T extends { name: string }>(item: T) => regex.test(item.name);
}

export function createReleaseYearFilter(minYear: string, maxYear: string) {
  return <T extends { releaseYear: string }>(item: T) => {
    return item.releaseYear >= minYear && item.releaseYear <= maxYear;
  };
}

export function createReviewYearFilter(minYear: string, maxYear: string) {
  return <T extends { reviewYear?: string }>(item: T) => {
    const year = item.reviewYear;
    if (!year) return false;
    return year >= minYear && year <= maxYear;
  };
}

// Common filter creators - simple functions that create filter functions
export function createTitleFilter(value: string | undefined) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return <T extends { title: string }>(item: T) => regex.test(item.title);
}

// Filter values helper
export function filterValues<TItem>({
  filters,
  values,
}: {
  filters: Record<string, (arg0: TItem) => boolean>;
  values: readonly TItem[];
}): TItem[] {
  return values.filter((item) => {
    return Object.values(filters).every((filter) => {
      return filter(item);
    });
  });
}

/**
 * Gets the group letter for a given string, typically used for alphabetical grouping.
 * Non-alphabetic characters are grouped under "#".
 *
 * @param str - The string to get the group letter from
 * @returns The uppercase first letter or "#" for non-alphabetic characters
 */
export function getGroupLetter(str: string): string {
  const letter = str.slice(0, 1);

  // Check if the character is non-alphabetic (same in upper and lower case)
  if (letter.toLowerCase() === letter.toUpperCase()) {
    return "#";
  }

  return letter.toLocaleUpperCase();
}

export function handlePendingFilterName<
  TItem extends { name: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  value: string | undefined,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createNameFilter(value);
  const baseState = updatePendingFilter(state, "name", filterFn, value);
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

export function handlePendingFilterReleaseYear<
  TItem extends { releaseYear: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  values: [string, string],
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createReleaseYearFilter(values[0], values[1]);
  const baseState = updatePendingFilter(state, "releaseYear", filterFn, values);
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

export function handlePendingFilterReviewYear<
  TItem extends { reviewYear?: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  values: [string, string],
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createReviewYearFilter(values[0], values[1]);
  const baseState = updatePendingFilter(state, "reviewYear", filterFn, values);
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

export function handlePendingFilterTitle<
  TItem extends { title: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  value: string | undefined,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createTitleFilter(value);
  const baseState = updatePendingFilter(state, "title", filterFn, value);
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Reset pending filters to current active filters
 */
export function resetPendingFilters<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> {
  const pendingFilteredCount = filterValues({
    filters: state.filters,
    values: state.allValues,
  }).length;

  return {
    ...state,
    hasActiveFilters: Object.keys(state.filterValues).length > 0,
    pendingFilteredCount,
    pendingFilters: { ...state.filters },
    pendingFilterValues: { ...state.filterValues },
  };
}

/**
 * Handle "Show More" pagination
 */
export function showMore<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
  increment: number,
  groupFn?: (values: TItem[], sort: TSortValue) => Map<string, TItem[]>,
): ListWithFiltersState<TItem, TSortValue> {
  const showCount = state.showCount + increment;
  const groupedValues = groupFn
    ? groupFn(state.filteredValues.slice(0, showCount), state.sortValue)
    : new Map<string, TItem[]>();

  return {
    ...state,
    groupedValues,
    showCount,
  };
}

/**
 * Handler functions that combine filter creation and state updates
 */

export function sortNumber(a: number, b: number): number {
  return a - b;
}

export function sortString(a: string, b: string): number {
  return collator.compare(a, b);
}

/**
 * Update a pending filter
 */
export function updatePendingFilter<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
  key: string,
  filterFn: ((item: TItem) => boolean) | undefined,
  value:
    | [number, number]
    | [string, string]
    | readonly string[]
    | string
    | undefined,
): ListWithFiltersState<TItem, TSortValue> {
  const pendingFilters = { ...state.pendingFilters };
  const pendingFilterValues = { ...state.pendingFilterValues };

  if (filterFn === undefined || value === undefined) {
    delete pendingFilters[key];
    delete pendingFilterValues[key];
  } else {
    pendingFilters[key] = filterFn;
    pendingFilterValues[key] = value;
  }

  const pendingFilteredCount = filterValues({
    filters: pendingFilters,
    values: state.allValues,
  }).length;

  return {
    ...state,
    hasActiveFilters: Object.keys(pendingFilterValues).length > 0,
    pendingFilteredCount,
    pendingFilters,
    pendingFilterValues,
  };
}

/**
 * Handle sorting
 */
export function updateSort<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
  sortValue: TSortValue,
  sortFn: (values: TItem[], sort: TSortValue) => TItem[],
  groupFn?: (values: TItem[], sort: TSortValue) => Map<string, TItem[]>,
): ListWithFiltersState<TItem, TSortValue> {
  const filteredValues = sortFn(state.filteredValues, sortValue);
  const groupedValues = groupFn
    ? groupFn(filteredValues.slice(0, state.showCount), sortValue)
    : new Map<string, TItem[]>();

  return {
    ...state,
    filteredValues,
    groupedValues,
    sortValue,
  };
}
