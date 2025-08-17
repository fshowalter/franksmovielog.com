import {
  applyPendingFilters,
  clearPendingFilters,
  createInitialState,
  createNameFilter,
  ListWithFiltersActions,
  type ListWithFiltersState,
  resetPendingFilters,
  sortNumber,
  sortString,
  updatePendingFilter,
  updateSort,
} from "~/components/ListWithFilters.reducerUtils";

import type { ListItemValue } from "./Collections";

export enum Actions {
  APPLY_PENDING_FILTERS = ListWithFiltersActions.APPLY_PENDING_FILTERS,
  CLEAR_PENDING_FILTERS = ListWithFiltersActions.CLEAR_PENDING_FILTERS,
  PENDING_FILTER_NAME = "PENDING_FILTER_NAME",
  RESET_PENDING_FILTERS = ListWithFiltersActions.RESET_PENDING_FILTERS,
  SORT = ListWithFiltersActions.SORT,
}

export type ActionType =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
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

type State = ListWithFiltersState<ListItemValue, Sort>;

// AIDEV-NOTE: Collections don't use grouping, so we don't pass a groupFn

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  return createInitialState({
    initialSort,
    showCount: Number.MAX_SAFE_INTEGER, // Collections don't paginate
    sortFn: sortValues,
    values,
  });
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case Actions.APPLY_PENDING_FILTERS: {
      return applyPendingFilters(state, sortValues);
    }

    case Actions.CLEAR_PENDING_FILTERS: {
      return clearPendingFilters(state);
    }

    case Actions.PENDING_FILTER_NAME: {
      const filterFn = createNameFilter(action.value);
      return updatePendingFilter(state, "name", filterFn, action.value);
    }

    case Actions.RESET_PENDING_FILTERS: {
      return resetPendingFilters(state);
    }

    case Actions.SORT: {
      return updateSort(state, action.value, sortValues);
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
