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
