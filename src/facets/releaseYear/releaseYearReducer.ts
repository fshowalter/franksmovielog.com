import { omitPendingKey } from "~/facets/omitPendingKey";

const STATE_KEY = "releaseYear";

const ActionTypes = {
  CHANGED: "releaseYear/changed" as const,
};

export type ReleaseYearFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: [string, string];
};

export function createReleaseYearFilterChangedAction(
  values: [string, string],
): ReleaseYearFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function releaseYearFacetReducer<
  TState extends {
    pendingFilterValues: { [STATE_KEY]?: [string, string] };
  },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as ReleaseYearFilterChangedAction;
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
