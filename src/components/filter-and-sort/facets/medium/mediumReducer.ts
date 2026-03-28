import { omitPendingKey } from "~/facets/omitPendingKey";

const STATE_KEY = "medium";

const ActionTypes = {
  CHANGED: "medium/changed" as const,
};

export type MediumFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: readonly string[];
};

export function createMediumFilterChangedAction(
  values: readonly string[],
): MediumFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function mediumFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as MediumFilterChangedAction;
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
      if (!filterKey.startsWith("medium-")) return state;
      const slug = filterKey.replace("medium-", "");
      const current = state.pendingFilterValues[STATE_KEY] ?? [];
      const updated = current.filter(
        (m) => m.toLowerCase().replaceAll(" ", "-") !== slug,
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
