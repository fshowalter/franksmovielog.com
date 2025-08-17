import {
  createNameFilter,
  filterValues,
  sortNumber,
  sortString,
} from "~/utils/reducerUtils";

import type { ListItemValue } from "./Collections";

export enum Actions {
  APPLY_PENDING_FILTERS = "APPLY_PENDING_FILTERS",
  CLEAR_PENDING_FILTERS = "CLEAR_PENDING_FILTERS",
  FILTER_NAME = "FILTER_NAME",
  PENDING_FILTER_NAME = "PENDING_FILTER_NAME",
  RESET_PENDING_FILTERS = "RESET_PENDING_FILTERS",
  SORT = "SORT",
}

export type ActionType =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | FilterNameAction
  | PendingFilterNameAction
  | ResetPendingFiltersAction
  | SortAction;

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc"
  | "title-count-asc"
  | "title-count-desc";

type ApplyPendingFiltersAction = {
  type: Actions.APPLY_PENDING_FILTERS;
};

type ClearPendingFiltersAction = {
  type: Actions.CLEAR_PENDING_FILTERS;
};

type FilterNameAction = {
  type: Actions.FILTER_NAME;
  value: string;
};

type PendingFilterNameAction = {
  type: Actions.PENDING_FILTER_NAME;
  value: string;
};

type ResetPendingFiltersAction = {
  type: Actions.RESET_PENDING_FILTERS;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type State = {
  allValues: ListItemValue[];
  filteredValues: ListItemValue[];
  filters: Record<string, (value: ListItemValue) => boolean>;
  filterValues: {
    name: string;
  };
  pendingFilteredCount: number;
  pendingFilters: Record<string, (value: ListItemValue) => boolean>;
  pendingFilterValues: {
    name: string;
  };
  sortValue: Sort;
};

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  const initialValues = sortValues(values, initialSort);

  return {
    allValues: [...initialValues],
    filteredValues: [...initialValues],
    filters: {},
    filterValues: {
      name: "",
    },
    pendingFilteredCount: initialValues.length,
    pendingFilters: {},
    pendingFilterValues: {
      name: "",
    },
    sortValue: initialSort,
  };
}

export function reducer(state: State, action: ActionType): State {
  let filters;
  let filteredValues;
  let pendingFilters;
  let pendingFilteredValues;

  switch (action.type) {
    case Actions.APPLY_PENDING_FILTERS: {
      // Apply pending filters to actual filters
      filteredValues = sortValues(
        filterValues<ListItemValue>({
          filters: state.pendingFilters,
          values: state.allValues,
        }),
        state.sortValue,
      );
      return {
        ...state,
        filteredValues,
        filters: { ...state.pendingFilters },
        filterValues: { ...state.pendingFilterValues },
        pendingFilteredCount: filteredValues.length,
      };
    }
    case Actions.CLEAR_PENDING_FILTERS: {
      // Clear all pending filters to empty/default values
      const clearedFilteredValues = state.allValues;
      return {
        ...state,
        pendingFilteredCount: clearedFilteredValues.length,
        pendingFilters: {},
        pendingFilterValues: {
          name: "",
        },
      };
    }
    case Actions.FILTER_NAME: {
      filters = action.value
        ? {
            ...state.filters,
            name: createNameFilter(action.value),
          }
        : (() => {
            const newFilters = { ...state.filters };
            delete newFilters.name;
            return newFilters;
          })();
      filteredValues = sortValues(
        filterValues<ListItemValue>({
          filters,
          values: state.allValues,
        }),
        state.sortValue,
      );
      return {
        ...state,
        filteredValues,
        filters,
        filterValues: {
          ...state.filterValues,
          name: action.value,
        },
      };
    }
    case Actions.PENDING_FILTER_NAME: {
      if (action.value) {
        pendingFilters = {
          ...state.pendingFilters,
          name: createNameFilter(action.value),
        };
      } else {
        // Clear the filter if value is empty
        pendingFilters = { ...state.pendingFilters };
        delete pendingFilters.name;
      }
      pendingFilteredValues = filterValues<ListItemValue>({
        filters: pendingFilters,
        values: state.allValues,
      });
      return {
        ...state,
        pendingFilteredCount: pendingFilteredValues.length,
        pendingFilters,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          name: action.value,
        },
      };
    }
    case Actions.RESET_PENDING_FILTERS: {
      // Reset pending filters to current applied filters
      pendingFilteredValues = filterValues<ListItemValue>({
        filters: state.filters,
        values: state.allValues,
      });
      return {
        ...state,
        pendingFilteredCount: pendingFilteredValues.length,
        pendingFilters: { ...state.filters },
        pendingFilterValues: { ...state.filterValues },
      };
    }
    case Actions.SORT: {
      filteredValues = sortValues(state.filteredValues, action.value);
      return {
        ...state,
        filteredValues,
        sortValue: action.value,
      };
    }

    // no default
  }
}

function sortValues(values: ListItemValue[], sortOrder: Sort): ListItemValue[] {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "name-asc": (a, b) => sortString(a.name, b.name),
      "name-desc": (a, b) => sortString(a.name, b.name) * -1,
      "review-count-asc": (a, b) => sortNumber(a.reviewCount, b.reviewCount),
      "review-count-desc": (a, b) =>
        sortNumber(a.reviewCount, b.reviewCount) * -1,
      "title-count-asc": (a, b) => sortNumber(a.titleCount, b.titleCount),
      "title-count-desc": (a, b) => sortNumber(a.titleCount, b.titleCount) * -1,
    };

  const comparer = sortMap[sortOrder];

  return values.sort(comparer);
}
