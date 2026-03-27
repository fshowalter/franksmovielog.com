import { omitPendingKey } from "~/facets/omitPendingKey";

export const STATE_KEY = "title";

const ActionTypes = {
  CHANGED: "titleFilters/titleFilterChanged" as const,
};

export type TitleFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  value: string;
};

export function createTitleFilterChangedAction(
  value: string,
): TitleFilterChangedAction {
  return { type: ActionTypes.CHANGED, value };
}

export function titleFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: string } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { value } = action as TitleFilterChangedAction;
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
