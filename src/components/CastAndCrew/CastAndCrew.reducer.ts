import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters.reducerUtils";

import {
  buildGroupValues,
  createInitialState,
  getGroupLetter,
  handleListWithFiltersAction,
  ListWithFiltersActions,
  sortName,
  sortReviewCount,
  updatePendingFilter,
} from "~/components/ListWithFilters.reducerUtils";

/**
 * CastAndCrew reducer with pending filters support
 */
import type { ListItemValue } from "./CastAndCrew";

enum CastAndCrewActions {
  PENDING_FILTER_CREDIT_KIND = "PENDING_FILTER_CREDIT_KIND",
}

// Re-export shared actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...CastAndCrewActions,
} as const;

export type ActionType =
  | ListWithFiltersActionType<Sort>
  | PendingFilterCreditKindAction;

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

// CastAndCrew-specific action
type PendingFilterCreditKindAction = {
  type: CastAndCrewActions.PENDING_FILTER_CREDIT_KIND;
  value: string;
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
      ...sortName<ListItemValue>(),
      ...sortReviewCount<ListItemValue>(),
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
    // showCount omitted - CastAndCrew doesn't paginate
    sortFn: sortValues,
    values,
  });
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case CastAndCrewActions.PENDING_FILTER_CREDIT_KIND: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.creditedAs.includes(typedAction.value)
          : undefined;
      return updatePendingFilter(state, "credits", filterFn, typedAction.value);
    }

    default: {
      // Handle shared actions
      return handleListWithFiltersAction(state, action, {
        groupFn: groupValues,
        sortFn: sortValues,
      });
    }
  }
}
