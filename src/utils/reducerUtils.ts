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

// Core types
export type FilterableState<TItem, TSortValue, TGroupedValues> = {
  allValues: TItem[];
  filteredValues: TItem[];
  filters: Record<string, (item: TItem) => boolean>;
  groupedValues: TGroupedValues;
  showCount: number;
  sortValue: TSortValue;
};

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

// Build group values factory
export function buildGroupValues<TItem, TSortValue>(
  valueGrouper: (item: TItem, sortValue: TSortValue) => string,
) {
  return function groupValues(
    items: TItem[],
    sortValue: TSortValue,
  ): Map<string, TItem[]> {
    const groupedValues = new Map<string, TItem[]>();

    for (const item of items) {
      const group = valueGrouper(item, sortValue);
      let groupValue = groupedValues.get(group);

      if (!groupValue) {
        groupValue = [];
        groupedValues.set(group, groupValue);
      }
      groupValue.push(item);
    }

    return groupedValues;
  };
}

// Filter tools factory
export function filterTools<TItem, TSortValue, TGroupedValues>(
  sorter: (items: TItem[], sortOrder: TSortValue) => TItem[],
  grouper: (items: TItem[], sortOrder: TSortValue) => TGroupedValues,
) {
  const applyFilters = buildApplyFilters(sorter, grouper);

  return {
    applyFilters,
    clearFilter: <
      TState extends FilterableState<TItem, TSortValue, TGroupedValues>,
    >(
      value: string,
      currentState: TState,
      key: string,
    ): TState | undefined => {
      if (value != "All") {
        return undefined;
      }

      const filters = {
        ...currentState.filters,
      };

      delete filters[key];

      return applyFilters(filters, currentState);
    },
    updateFilter: <
      TState extends FilterableState<TItem, TSortValue, TGroupedValues>,
    >(
      currentState: TState,
      key: string,
      handler: (item: TItem) => boolean,
    ): TState => {
      const filters = {
        ...currentState.filters,
        [key]: handler,
      };

      return applyFilters(filters, currentState);
    },
  };
}

// Build apply filters helper
function buildApplyFilters<TItem, TSortValue, TGroupedValues>(
  sorter: (values: TItem[], sortOrder: TSortValue) => TItem[],
  grouper: (values: TItem[], sortOrder: TSortValue) => TGroupedValues,
) {
  return function applyFilters<
    TState extends FilterableState<TItem, TSortValue, TGroupedValues>,
  >(
    newFilters: Record<string, (value: TItem) => boolean>,
    currentState: TState,
  ): TState {
    const filteredValues = sorter(
      filterValues({
        filters: newFilters,
        values: currentState.allValues,
      }),
      currentState.sortValue,
    );

    const groupedValues = grouper(
      filteredValues.slice(0, currentState.showCount),
      currentState.sortValue,
    );

    return {
      ...currentState,
      filteredValues,
      filters: newFilters,
      groupedValues,
    };
  };
}

// Common filter handlers

export function handleFilterTitle<
  TItem extends { title: string },
  TSortValue,
  TGroupedValues,
  TState extends FilterableState<TItem, TSortValue, TGroupedValues>,
>(
  state: TState,
  value: string,
  updateFilter: (
    currentState: TState,
    key: string,
    handler: (item: TItem) => boolean,
  ) => TState,
): TState {
  const regex = new RegExp(value, "i");
  return updateFilter(state, "title", (item) => {
    return regex.test(item.title);
  });
}

export function handleFilterName<
  TItem extends { name: string },
  TSortValue,
  TGroupedValues,
  TState extends FilterableState<TItem, TSortValue, TGroupedValues>,
>(
  state: TState,
  value: string,
  updateFilter: (
    currentState: TState,
    key: string,
    handler: (item: TItem) => boolean,
  ) => TState,
): TState {
  const regex = new RegExp(value, "i");
  return updateFilter(state, "name", (item) => {
    return regex.test(item.name);
  });
}

export function handleFilterReleaseYear<
  TItem extends { releaseYear?: number | string; year?: number | string },
  TSortValue,
  TGroupedValues,
  TState extends FilterableState<TItem, TSortValue, TGroupedValues>,
>(
  state: TState,
  values: [number | string, number | string],
  updateFilter: (
    currentState: TState,
    key: string,
    handler: (item: TItem) => boolean,
  ) => TState,
): TState {
  const [minYear, maxYear] = values;
  return updateFilter(state, "releaseYear", (item) => {
    const year = item.releaseYear || item.year;
    if (!year) return false;
    return year >= minYear && year <= maxYear;
  });
}

export function handleFilterReviewYear<
  TItem extends { reviewYear?: number | string },
  TSortValue,
  TGroupedValues,
  TState extends FilterableState<TItem, TSortValue, TGroupedValues>,
>(
  state: TState,
  values: [number | string, number | string],
  applySort: (values: TItem[], sortValue: TSortValue) => TItem[],
  groupValues: (items: TItem[], sortOrder: TSortValue) => TGroupedValues,
): TState {
  const { updateFilter } = filterTools(applySort, groupValues);
  const [minYear, maxYear] = values;
  return updateFilter(state, "reviewYear", (item: TItem) => {
    const reviewYear = item.reviewYear;
    if (!reviewYear) return false;
    return reviewYear >= minYear && reviewYear <= maxYear;
  });
}

export function handleShowMore<
  TItem,
  TSortValue,
  TGroupedValues,
  TState extends FilterableState<TItem, TSortValue, TGroupedValues> & {
    showCount: number;
  },
>(
  state: TState,
  showCountDefault: number,
  groupValues: (items: TItem[], sortOrder: TSortValue) => TGroupedValues,
): TState {
  const showCount = state.showCount + showCountDefault;
  const groupedValues = groupValues(
    state.filteredValues.slice(0, showCount),
    state.sortValue,
  );
  return {
    ...state,
    groupedValues,
    showCount,
  } as TState;
}

export function handleSort<
  TItem,
  TSortValue,
  TGroupedValues,
  TState extends FilterableState<TItem, TSortValue, TGroupedValues>,
>(
  state: TState,
  sortValue: TSortValue,
  sortFn: (values: TItem[], sortOrder: TSortValue) => TItem[],
  groupValues: (items: TItem[], sortOrder: TSortValue) => TGroupedValues,
): TState {
  const filteredValues = sortFn(state.filteredValues, sortValue);
  const showCount = (state as any).showCount || state.filteredValues.length;
  const groupedValues = groupValues(
    filteredValues.slice(0, showCount),
    sortValue,
  );
  return {
    ...state,
    filteredValues,
    groupedValues,
    sortValue,
  };
}

export function handleToggleReviewed<
  TItem extends { reviewed?: boolean; slug?: string },
  TSortValue,
  TGroupedValues,
>(
  state: FilterableState<TItem, TSortValue, TGroupedValues> & {
    hideReviewed?: boolean;
  },
  reviewedFilter: ((item: TItem) => boolean) | undefined,
  applySort: (values: TItem[], sortValue: TSortValue) => TItem[],
  groupValues: (items: TItem[], sortOrder: TSortValue) => TGroupedValues,
): FilterableState<TItem, TSortValue, TGroupedValues> & {
  hideReviewed?: boolean;
} {
  const { clearFilter, updateFilter } = filterTools(applySort, groupValues);

  if (state.hideReviewed) {
    const newState = clearFilter("All", state, "reviewed");
    return newState ? { ...newState, hideReviewed: false } : state;
  }

  const filter = reviewedFilter || ((item: TItem) => !item.reviewed);
  return {
    ...updateFilter(state, "reviewed", filter),
    hideReviewed: true,
  };
}