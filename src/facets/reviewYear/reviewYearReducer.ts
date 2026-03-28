import { omitPendingKey } from "~/facets/omitPendingKey";

const STATE_KEY = "reviewYear";

const ActionTypes = {
  CHANGED: "reviewYear/changed" as const,
};

export type ReviewYearFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: [string, string];
};

export function createReviewYearFilterChangedAction(
  values: [string, string],
): ReviewYearFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function reviewYearFacetReducer<
  TState extends {
    pendingFilterValues: { [STATE_KEY]?: [string, string] };
  },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as ReviewYearFilterChangedAction;
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
