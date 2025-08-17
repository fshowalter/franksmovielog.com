import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters.reducerUtils";

import {
  buildSortValues,
  createInitialState,
  handleListWithFiltersAction,
  handleNameFilterAction,
  ListWithFiltersActions,
  sortName,
  sortNumber,
  sortReviewCount,
} from "~/components/ListWithFilters.reducerUtils";

import type { ListItemValue } from "./Collections";

// Collections only uses shared actions

export type ActionType = ListWithFiltersActionType<Sort>;

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc"
  | "title-count-asc"
  | "title-count-desc";

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
    showMoreEnabled: false,
    sortFn: sortValues,
    values,
  });
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    // Field-specific shared filter
    case ListWithFiltersActions.PENDING_FILTER_NAME: {
      return handleNameFilterAction(state, action);
    }

    default: {
      // Handle shared list structure actions
      return handleListWithFiltersAction(state, action, { sortFn: sortValues });
    }
  }
}

const sortValues = buildSortValues<ListItemValue, Sort>({
  ...sortName<ListItemValue>(),
  ...sortReviewCount<ListItemValue>(),
  "title-count-asc": (a, b) => sortNumber(a.titleCount, b.titleCount),
  "title-count-desc": (a, b) => sortNumber(a.titleCount, b.titleCount) * -1,
});

export { ListWithFiltersActions as Actions } from "~/components/ListWithFilters.reducerUtils";
