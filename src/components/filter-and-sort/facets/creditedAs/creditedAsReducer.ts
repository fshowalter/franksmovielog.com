import { omitPendingKey } from "~/facets/omitPendingKey";

const STATE_KEY = "creditedAs";

const ActionTypes = {
  CHANGED: "creditedAs/changed" as const,
};

export type CreditedAsFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: string[];
};

export function createCreditedAsFilterChangedAction(
  values: string[],
): CreditedAsFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function creditedAsFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as CreditedAsFilterChangedAction;
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
      if (!filterKey.startsWith("creditedAs-")) return state;
      // AIDEV-NOTE: Credit values in data are lowercase ("director", "performer", "writer")
      // Do NOT capitalize - use as-is to match actual data format
      const creditValue = filterKey.replace(/^creditedAs-/, "");
      const current = state.pendingFilterValues[STATE_KEY] ?? [];
      const updated = current.filter((c) => c !== creditValue);
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
