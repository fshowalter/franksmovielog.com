import type {
  CollectionFilterValues,
  CollectionsActionType,
  CollectionsListState,
  CollectionsSortType,
} from "~/components/ListWithFilters/collectionsReducerUtils";

import {
  CollectionsActions,
  createCollectionGroupForValue,
  handleNameFilterAction,
  sortName,
  sortReviewCount,
} from "~/components/ListWithFilters/collectionsReducerUtils";
import {
  createInitialState,
  handleListWithFiltersAction,
  updatePendingFilter,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  buildGroupValues,
  buildSortValues,
} from "~/components/utils/reducerUtils";

/**
 * CastAndCrew reducer with pending filters support
 */
import type { ListItemValue } from "./CastAndCrew";

enum CastAndCrewActions {
  PENDING_FILTER_CREDITED_AS = "PENDING_FILTER_CREDITED_AS",
}

export type CastAndCrewFilterValues = CollectionFilterValues & {
  creditedAs?: string;
};

// Re-export actions for component convenience
import { ListWithFiltersActions } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";

export const Actions = {
  ...ListWithFiltersActions,
  ...CollectionsActions,
  ...CastAndCrewActions,
} as const;

export type ActionType =
  | CollectionsActionType<Sort>
  | PendingFilterCreditedAsAction;

export type Sort = CollectionsSortType;

// CastAndCrew-specific action
type PendingFilterCreditedAsAction = {
  type: CastAndCrewActions.PENDING_FILTER_CREDITED_AS;
  value: string;
};

type State = CollectionsListState<ListItemValue, Sort>;

const groupForValue = createCollectionGroupForValue<
  ListItemValue,
  CollectionsSortType
>();

const sortValues = buildSortValues<ListItemValue, Sort>({
  ...sortName<ListItemValue>(),
  ...sortReviewCount<ListItemValue>(),
});

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
    showCount: undefined, // CastAndCrew doesn't paginate
    sortFn: sortValues,
    values,
  }) as State;
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case CastAndCrewActions.PENDING_FILTER_CREDITED_AS: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.creditedAs.includes(typedAction.value)
          : undefined;
      const filterKey: keyof CastAndCrewFilterValues = "creditedAs";
      return updatePendingFilter(state, filterKey, filterFn, typedAction.value);
    }

    // Field-specific shared filter
    case CollectionsActions.PENDING_FILTER_NAME: {
      return handleNameFilterAction(state, action);
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
