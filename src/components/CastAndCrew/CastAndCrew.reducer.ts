import {
  applyPendingFilters,
  buildGroupValues,
  clearPendingFilters,
  createInitialState,
  createNameFilter,
  getGroupLetter,
  ListWithFiltersActions,
  type ListWithFiltersState,
  resetPendingFilters,
  showMore,
  sortNumber,
  sortString,
  updatePendingFilter,
  updateSort,
} from "~/components/ListWithFilters.reducerUtils";

/**
 * CastAndCrew reducer with pending filters support
 */
import type { ListItemValue } from "./CastAndCrew";

export enum Actions {
  APPLY_PENDING_FILTERS = ListWithFiltersActions.APPLY_PENDING_FILTERS,
  CLEAR_PENDING_FILTERS = ListWithFiltersActions.CLEAR_PENDING_FILTERS,
  PENDING_FILTER_CREDIT_KIND = "PENDING_FILTER_CREDIT_KIND",
  PENDING_FILTER_NAME = "PENDING_FILTER_NAME",
  RESET_PENDING_FILTERS = ListWithFiltersActions.RESET_PENDING_FILTERS,
  SHOW_MORE = ListWithFiltersActions.SHOW_MORE,
  SORT = ListWithFiltersActions.SORT,
}

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

const SHOW_COUNT_DEFAULT = 100;

export type ActionType =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | PendingFilterCreditKindAction
  | PendingFilterNameAction
  | ResetPendingFiltersAction
  | ShowMoreAction
  | SortAction;

type ApplyPendingFiltersAction = {
  type: Actions.APPLY_PENDING_FILTERS;
};

type ClearPendingFiltersAction = {
  type: Actions.CLEAR_PENDING_FILTERS;
};

type PendingFilterCreditKindAction = {
  type: Actions.PENDING_FILTER_CREDIT_KIND;
  value: string;
};

type PendingFilterNameAction = {
  type: Actions.PENDING_FILTER_NAME;
  value: string;
};

type ResetPendingFiltersAction = {
  type: Actions.RESET_PENDING_FILTERS;
};

type ShowMoreAction = {
  type: Actions.SHOW_MORE;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type State = ListWithFiltersState<ListItemValue, Sort>;

// Helper functions
function groupForValue(item: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "name-asc":
    case "name-desc": {
      return getGroupLetter(item.name);
    }
    case "review-count-asc":
    case "review-count-desc": {
      return "";
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
    };

  const comparer = sortMap[sortOrder];
  return [...values].sort(comparer);
}

const groupValues = buildGroupValues(groupForValue);

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
    showCount: SHOW_COUNT_DEFAULT,
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

    case Actions.PENDING_FILTER_CREDIT_KIND: {
      const filterFn =
        action.value && action.value !== "All"
          ? (value: ListItemValue) => value.creditedAs.includes(action.value)
          : undefined;
      return updatePendingFilter(state, "credits", filterFn, action.value);
    }

    case Actions.PENDING_FILTER_NAME: {
      const filterFn = createNameFilter(action.value);
      return updatePendingFilter(state, "name", filterFn, action.value);
    }

    case Actions.RESET_PENDING_FILTERS: {
      return resetPendingFilters(state);
    }

    case Actions.SHOW_MORE: {
      return showMore(state, SHOW_COUNT_DEFAULT, groupValues);
    }

    case Actions.SORT: {
      return updateSort(state, action.value, sortValues, groupValues);
    }

    // no default
  }
}
