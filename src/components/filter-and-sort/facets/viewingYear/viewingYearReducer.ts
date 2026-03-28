import { omitPendingKey } from "~/facets/omitPendingKey";

const STATE_KEY = "viewingYear";

const ActionTypes = {
  CHANGED: "viewingYear/changed" as const,
};

export type ViewingYearFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: [string, string];
};

export function createViewingYearFilterChangedAction(
  values: [string, string],
): ViewingYearFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function viewingYearFacetReducer<
  TState extends {
    pendingFilterValues: { [STATE_KEY]?: [string, string] };
  },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as ViewingYearFilterChangedAction;
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          [STATE_KEY]: values,
        },
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
