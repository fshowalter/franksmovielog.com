import { omitPendingKey } from "~/facets/omitPendingKey";

const STATE_KEY = "director";

const ActionTypes = {
  CHANGED: "director/changed" as const,
};

export type DirectorFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: readonly string[];
};

export function createDirectorFilterChangedAction(
  values: readonly string[],
): DirectorFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function directorFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as DirectorFilterChangedAction;
      if (values.length === 0) {
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
        pendingFilterValues: {
          ...state.pendingFilterValues,
          [STATE_KEY]: values,
        },
      };
    }
    case "filters/removeAppliedFilter": {
      const { filterKey } = action as { filterKey: string; type: string };
      if (!filterKey.startsWith("director-")) return state;
      const slug = filterKey.replace("director-", "");
      const current = state.pendingFilterValues[STATE_KEY] ?? [];
      const updated = current.filter(
        (d) => d.toLowerCase().replaceAll(" ", "-") !== slug,
      );
      if (updated.length === 0) {
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
        pendingFilterValues: {
          ...state.pendingFilterValues,
          [STATE_KEY]: updated,
        },
      };
    }
    default: {
      return state;
    }
  }
}
