import {
  createNameFilter,
  filterValues,
  sortNumber,
  sortString,
} from "~/utils/reducerUtils";

import type { ListItemValue } from "./Collections";

export enum Actions {
  FILTER_NAME = "FILTER_NAME",
  SORT = "SORT",
}

export type ActionType = FilterNameAction | SortAction;

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc"
  | "title-count-asc"
  | "title-count-desc";

type FilterNameAction = {
  type: Actions.FILTER_NAME;
  value: string;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type State = {
  allValues: ListItemValue[];
  filteredValues: ListItemValue[];
  filters: Record<string, (value: ListItemValue) => boolean>;
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
    sortValue: initialSort,
  };
}

export function reducer(state: State, action: ActionType): State {
  let filters;
  let filteredValues;

  switch (action.type) {
    case Actions.FILTER_NAME: {
      filters = {
        ...state.filters,
        name: createNameFilter(action.value),
      };
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
