import { type FilterableState, filterTools } from "~/utils/filterTools";
import { getGroupLetter } from "~/utils/getGroupLetter";

// Core Types
export type BaseListItem = Record<string, unknown>;

export type FilterConfig = {
  actionType: string;
  clearable?: boolean; // Support "All" clearing pattern
  filterFn: (value: unknown) => (item: unknown) => boolean;
};

export type ListReducerConfig<
  TItem extends BaseListItem,
  TSort extends string,
  TGroup,
> = {
  // Additional state properties
  additionalState?: Record<string, unknown>;
  // Custom grouping function (optional)
  customGroupValues?: (items: TItem[], sort: TSort) => TGroup;

  // Filter configurations
  filters?: {
    custom?: Record<string, FilterConfig>; // Custom filters
    releaseYear?: boolean; // Enable FILTER_RELEASE_YEAR
    reviewed?: ((item: TItem) => boolean) | boolean; // Enable TOGGLE_REVIEWED with optional custom logic
    reviewYear?: boolean; // Enable FILTER_REVIEW_YEAR
    title?: boolean; // Enable FILTER_TITLE action
  };
  groupByLetter?: boolean; // default: true

  // Required configuration
  initialSort: TSort;

  // Optional configuration with defaults
  showCountDefault?: number; // default: 100

  sortMap: Record<TSort, (a: TItem, b: TItem) => number>;
};

// Built-in group values builder
export function buildGroupValues<T, S>(
  valueGrouper: (item: T, sortValue: S) => string,
) {
  return function groupValues(items: T[], sortValue: S): Map<string, T[]> {
    const groupedValues = new Map<string, T[]>();

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

// Action Factory
type ActionMap<T extends ListReducerConfig<any, any, any>> = {
  SHOW_MORE: "SHOW_MORE";
  SORT: "SORT";
} & (T["filters"] extends { title: true } ? { FILTER_TITLE: "FILTER_TITLE" } : {}) &
  (T["filters"] extends { releaseYear: true } ? { FILTER_RELEASE_YEAR: "FILTER_RELEASE_YEAR" } : {}) &
  (T["filters"] extends { reviewYear: true } ? { FILTER_REVIEW_YEAR: "FILTER_REVIEW_YEAR" } : {}) &
  (T["filters"] extends { reviewed: boolean | ((item: any) => boolean) } ? { TOGGLE_REVIEWED: "TOGGLE_REVIEWED" } : {}) &
  (T["filters"] extends { custom: infer C } ? (C extends Record<string, FilterConfig> ? { [K in keyof C]: K } : {}) : {});

export function createActions<TConfig extends ListReducerConfig<any, any, any>>(
  config: TConfig,
): ActionMap<TConfig> {
  const baseActions = {
    SHOW_MORE: "SHOW_MORE",
    SORT: "SORT",
  } as const;

  const filterActions: Record<string, string> = {};

  if (config.filters?.title) {
    filterActions.FILTER_TITLE = "FILTER_TITLE";
  }
  if (config.filters?.releaseYear) {
    filterActions.FILTER_RELEASE_YEAR = "FILTER_RELEASE_YEAR";
  }
  if (config.filters?.reviewYear) {
    filterActions.FILTER_REVIEW_YEAR = "FILTER_REVIEW_YEAR";
  }
  if (config.filters?.reviewed) {
    filterActions.TOGGLE_REVIEWED = "TOGGLE_REVIEWED";
  }

  // Add custom filter actions
  if (config.filters?.custom) {
    for (const key of Object.keys(config.filters.custom)) {
      filterActions[key] = key;
    }
  }

  return { ...baseActions, ...filterActions } as ActionMap<TConfig>;
}

// Reducer Factory
export function createListReducer<
  TItem extends BaseListItem,
  TSort extends string,
  TGroup,
>(config: ListReducerConfig<TItem, TSort, TGroup>) {
  const SHOW_COUNT_DEFAULT = config.showCountDefault ?? 100;
  const Actions = createActions(config);

  // Build group values function  
  const defaultGrouper = config.groupByLetter === false
    ? (items: TItem[], _sortValue: TSort) => items as unknown as TGroup
    : buildGroupValues<TItem, TSort>((item: TItem) => {
        const itemWithName = item as { sortName?: string; name?: string };
        return getGroupLetter(itemWithName.sortName || itemWithName.name || "");
      });
  
  const groupValues = config.customGroupValues || defaultGrouper;

  // Initial state function
  function initState({
    initialSort,
    values,
  }: {
    initialSort: TSort;
    values: TItem[];
  }) {
    const initialState = {
      allValues: values,
      filteredValues: values,
      filters: {},
      groupedValues: groupValues(
        values.slice(0, SHOW_COUNT_DEFAULT),
        initialSort,
      ) as TGroup,
      showCount: SHOW_COUNT_DEFAULT,
      sortValue: initialSort,
    };

    // Add additional state properties
    if (config.additionalState) {
      Object.assign(initialState, config.additionalState);
    }

    return initialState as FilterableState<TItem, TSort, TGroup> & Record<string, unknown>;
  }

  // Main reducer function
  function reducer(
    state: ReturnType<typeof initState>,
    action: Record<string, unknown>,
  ): ReturnType<typeof initState> {
    function applySort(values: TItem[], sortValue: TSort) {
      const sortFn = config.sortMap[sortValue];
      return values.sort(sortFn);
    }

    const filterHelpers = filterTools<TItem, TSort, TGroup>(
      applySort,
      groupValues,
    );
    
    const updateFilter = filterHelpers.updateFilter;
    
    // Custom clearFilter that handles the 3-argument version
    const clearFilter = (currentState: typeof state, key: string) => {
      return filterHelpers.clearFilter("All", currentState, key);
    };

    switch (action.type) {
      case Actions.FILTER_RELEASE_YEAR: {
        if (!config.filters?.releaseYear) return state;

        const [minYear, maxYear] = (action.value || action.values) as [number | string, number | string];
        return updateFilter(state, "releaseYear", (item: TItem) => {
          const itemWithYear = item as { releaseYear?: number | string; year?: number | string; };
          const year = itemWithYear.year || itemWithYear.releaseYear;
          if (!year) return false;
          return year >= minYear && year <= maxYear;
        });
      }

      case Actions.FILTER_REVIEW_YEAR: {
        if (!config.filters?.reviewYear) return state;

        const [minYear, maxYear] = action.value as [number | string, number | string];
        return updateFilter(state, "reviewYear", (item: TItem) => {
          const reviewYear = (item as { reviewYear?: number | string }).reviewYear;
          if (!reviewYear) return false;
          return reviewYear >= minYear && reviewYear <= maxYear;
        });
      }

      // Optional filter actions
      case Actions.FILTER_TITLE: {
        if (!config.filters?.title) return state;

        const regex = new RegExp(action.value as string, "i");
        return updateFilter(state, "title", (item: TItem) => {
          // Support both 'title' and 'name' fields
          const itemWithText = item as { name?: string; title?: string; };
          const searchText = itemWithText.title || itemWithText.name || "";
          return regex.test(searchText);
        });
      }

      case Actions.SHOW_MORE: {
        const showCount = state.showCount + SHOW_COUNT_DEFAULT;
        const groupedValues = groupValues(
          state.filteredValues.slice(0, showCount),
          state.sortValue,
        );
        return {
          ...state,
          groupedValues: groupedValues as TGroup,
          showCount,
        };
      }

      // Core actions
      case Actions.SORT: {
        const groupedValues = groupValues(
          state.filteredValues.slice(0, state.showCount),
          action.value as TSort,
        );
        return {
          ...state,
          groupedValues: groupedValues as TGroup,
          sortValue: action.value as TSort,
        };
      }

      case Actions.TOGGLE_REVIEWED: {
        if (!config.filters?.reviewed) return state;
        if (!("TOGGLE_REVIEWED" in Actions)) return state;

        if (state.hideReviewed) {
          const newState = clearFilter(state, "reviewed");
          return newState ? {
            ...newState,
            hideReviewed: false,
          } : state;
        }

        const reviewedFilter =
          typeof config.filters.reviewed === "function"
            ? config.filters.reviewed
            : (item: TItem) => !(item as { reviewed?: boolean }).reviewed;

        return {
          ...updateFilter(state, "reviewed", reviewedFilter),
          hideReviewed: true,
        };
      }

      // Handle custom filters
      default: {
        const actionType = action.type as string;
        if (config.filters?.custom && config.filters.custom[actionType]) {
          const filterConfig = config.filters.custom[actionType];

          // Handle "All" filter clearing pattern if clearable
          if (filterConfig.clearable && action.value === "All") {
            const newState = clearFilter(state, actionType.toLowerCase());
            return newState || state;
          }

          return updateFilter(
            state,
            actionType.toLowerCase(),
            filterConfig.filterFn(action.value),
          );
        }
        return state;
      }
    }
  }

  return {
    Actions,
    initState,
    reducer,
  };
}
