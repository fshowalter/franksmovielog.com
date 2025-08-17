import {
  applyPendingFilters,
  buildGroupValues,
  clearPendingFilters,
  createInitialState,
  type PendingFiltersState,
  resetPendingFilters,
  updatePendingFilter,
  updateSort,
} from "~/utils/pendingFilters";
import { createNameFilter, sortNumber, sortString } from "~/utils/reducerUtils";

import type { ListItemValue } from "./Collections";

export enum Actions {
  APPLY_PENDING_FILTERS = "APPLY_PENDING_FILTERS",
  CLEAR_PENDING_FILTERS = "CLEAR_PENDING_FILTERS",
  PENDING_FILTER_NAME = "PENDING_FILTER_NAME",
  RESET_PENDING_FILTERS = "RESET_PENDING_FILTERS",
  SORT = "SORT",
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

type State = PendingFiltersState<ListItemValue, Sort>;

// AIDEV-NOTE: Collections don't use grouping, so we use a simple no-op group function
const groupValues = buildGroupValues<ListItemValue, Sort>(() => "all");

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  return createInitialState({
    groupFn: groupValues,
    initialSort,
    showCount: Number.MAX_SAFE_INTEGER, // Collections don't paginate
    sortFn: sortValues,
    values,
  });
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case Actions.APPLY_PENDING_FILTERS: {
      return applyPendingFilters(state, sortValues, groupValues);
    }

    case Actions.CLEAR_PENDING_FILTERS: {
      return clearPendingFilters(state);
    }

    case Actions.PENDING_FILTER_NAME: {
      const filterFn = action.value
        ? createNameFilter(action.value)
        : undefined;
      return updatePendingFilter(state, "name", filterFn, action.value);
    }

    case Actions.RESET_PENDING_FILTERS: {
      return resetPendingFilters(state);
    }

    case Actions.SORT: {
      return updateSort(state, action.value, sortValues, groupValues);
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
