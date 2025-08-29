import type { CollectionsActionType } from "~/components/ListWithFilters/collectionsReducerUtils";
import type { ListWithFiltersState } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";

import {
  CollectionsActions,
  handleNameFilterAction,
  sortName,
  sortReviewCount,
} from "~/components/ListWithFilters/collectionsReducerUtils";
import {
  createInitialState,
  handleListWithFiltersAction,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import { buildSortValues } from "~/components/utils/reducerUtils";

import type { ListItemValue } from "./Collections";

// Collections only uses shared actions

export type ActionType = CollectionsActionType<Sort>;

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

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
    showCount: undefined, // Collections don't paginate
    sortFn: sortValues,
    values,
  });
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    // Field-specific shared filter
    case CollectionsActions.PENDING_FILTER_NAME: {
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
});

import { ListWithFiltersActions } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";

export const Actions = {
  ...ListWithFiltersActions,
  ...CollectionsActions,
} as const;
