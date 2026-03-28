import { omitPendingKey } from "~/facets/omitPendingKey";

const STATE_KEY = "writer";

const ActionTypes = {
  CHANGED: "writer/changed" as const,
};

export type WriterFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: readonly string[];
};

export function createWriterFilterChangedAction(
  values: readonly string[],
): WriterFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function writerFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as WriterFilterChangedAction;
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
      if (!filterKey.startsWith("writer-")) return state;
      const slug = filterKey.replace("writer-", "");
      const current = state.pendingFilterValues[STATE_KEY] ?? [];
      const updated = current.filter(
        (w) => w.toLowerCase().replaceAll(" ", "-") !== slug,
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
