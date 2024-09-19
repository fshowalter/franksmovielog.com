import { filterValues } from "src/utils/filterTools";
import { sortNumber, sortString } from "src/utils/sortTools";

import type { ListItemValue } from "./Collections";

export enum Actions {
  FILTER_NAME = "FILTER_NAME",
  SORT = "SORT",
  TOGGLE_FILTERS = "TOGGLE_FILTERS",
}

export type Sort =
  | "name-asc"
  | "name-desc"
  | "title-count-asc"
  | "title-count-desc"
  | "review-count-asc"
  | "review-count-desc";

function sortValues(values: ListItemValue[], sortOrder: Sort): ListItemValue[] {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "name-asc": (a, b) => sortString(a.name, b.name),
      "name-desc": (a, b) => sortString(a.name, b.name) * -1,
      "title-count-asc": (a, b) => sortNumber(a.titleCount, b.titleCount),
      "title-count-desc": (a, b) => sortNumber(a.titleCount, b.titleCount) * -1,
      "review-count-asc": (a, b) => sortNumber(a.reviewCount, b.reviewCount),
      "review-count-desc": (a, b) =>
        sortNumber(a.reviewCount, b.reviewCount) * -1,
    };

  const comparer = sortMap[sortOrder];

  return values.sort(comparer);
}

interface State {
  allValues: ListItemValue[];
  filteredValues: ListItemValue[];
  filters: Record<string, (value: ListItemValue) => boolean>;
  sortValue: Sort;
  showFilters: boolean;
}

export function initState({
  values,
  initialSort,
}: {
  values: readonly ListItemValue[];
  initialSort: Sort;
}): State {
  return {
    allValues: [...values],
    filteredValues: [...values],
    filters: {},
    sortValue: initialSort,
    showFilters: false,
  };
}

interface FilterNameAction {
  type: Actions.FILTER_NAME;
  value: string;
}

interface SortAction {
  type: Actions.SORT;
  value: Sort;
}

interface ToggleFiltersAction {
  type: Actions.TOGGLE_FILTERS;
}

export type ActionType = FilterNameAction | SortAction | ToggleFiltersAction;

export function reducer(state: State, action: ActionType): State {
  let filters;
  let filteredValues;

  switch (action.type) {
    case Actions.FILTER_NAME: {
      const regex = new RegExp(action.value, "i");
      filters = {
        ...state.filters,
        name: (person: ListItemValue) => {
          return regex.test(person.name);
        },
      };
      filteredValues = sortValues(
        filterValues<ListItemValue>({
          values: state.allValues,
          filters,
        }),
        state.sortValue,
      );
      return {
        ...state,
        filters,
        filteredValues,
      };
    }
    case Actions.SORT: {
      filteredValues = sortValues(state.filteredValues, action.value);
      return {
        ...state,
        sortValue: action.value,
        filteredValues,
      };
    }
    case Actions.TOGGLE_FILTERS: {
      return {
        ...state,
        showFilters: !state.showFilters,
      };
    }
    // no default
  }
}
