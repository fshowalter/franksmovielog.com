import { omitPendingKey } from "~/facets/omitPendingKey";

export const STATE_KEY = "name";

const ActionTypes = {
  CHANGED: "collectionFilters/nameFilterChanged" as const,
};

export type NameFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  value: string;
};

export function createNameFilterChangedAction(
  value: string,
): NameFilterChangedAction {
  return { type: ActionTypes.CHANGED, value };
}

export function nameFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: string } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { value } = action as NameFilterChangedAction;
      if (value === "") {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            STATE_KEY,
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: { ...state.pendingFilterValues, [STATE_KEY]: value },
      };
    }
    case "filters/removeAppliedFilter": {
      const { filterKey } = action as { filterKey: string; type: string };
      if (filterKey !== STATE_KEY) return state;
      return {
        ...state,
        pendingFilterValues: omitPendingKey(
          state.pendingFilterValues,
          STATE_KEY,
        ),
      };
    }
    default: {
      return state;
    }
  }
}
