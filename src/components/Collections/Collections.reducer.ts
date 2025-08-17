import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters.reducerUtils";

import {
  createInitialState,
  handleListWithFiltersAction,
  
  sortNumber,
  sortString,
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
  // All actions are handled by the shared handler
  return handleListWithFiltersAction(
    state,
    action,
    { sortFn: sortValues },
  );
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

export {ListWithFiltersActions as Actions} from "~/components/ListWithFilters.reducerUtils";