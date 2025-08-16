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
import { collator } from "./collator";

// Core types
type FilterableState<TItem, TSortValue, TGroupedValues> = {
  allValues: TItem[];
  filteredValues: TItem[];
  filters: Record<string, (item: TItem) => boolean>;
  groupedValues: TGroupedValues;
  showCount: number;
  sortValue: TSortValue;
};

// Common state update patterns
function applyShowMore<
  TItem,
  TSortValue,
  TGroupedValues,
  TState extends {
    filteredValues: TItem[];
    groupedValues: TGroupedValues;
    showCount: number;
    sortValue: TSortValue;
  },
>(
  state: TState,
  increment: number,
  groupValues: (items: TItem[], sortValue: TSortValue) => TGroupedValues,
): TState {
  const showCount = state.showCount + increment;
  const groupedValues = groupValues(
    state.filteredValues.slice(0, showCount),
    state.sortValue,
  );
  return {
    ...state,
    groupedValues,
    showCount,
  };
}

// Build group values factory
function buildGroupValues<TItem, TSortValue>(
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

export function createNameFilter(value: string) {
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
export function createTitleFilter(value: string) {
  const regex = new RegExp(value, "i");
  return <T extends { title: string }>(item: T) => regex.test(item.title);
}

// Filter tools factory
function filterTools<TItem, TSortValue, TGroupedValues>(
  sorter: (items: TItem[], sortOrder: TSortValue) => TItem[],
  grouper: (items: TItem[], sortOrder: TSortValue) => TGroupedValues,
) {
  const applyFilters = buildApplyFilters(sorter, grouper);

  const updateFilter = <
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
  };

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
    updateFilter,
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

export function sortNumber(a: number, b: number): number {
  return a - b;
}

export function sortString(a: string, b: string): number {
  return collator.compare(a, b);
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
