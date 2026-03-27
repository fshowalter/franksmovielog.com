import { omitPendingKey } from "~/facets/omitPendingKey";

export const STATE_KEY = "genres";

const ActionTypes = {
  CHANGED: "titleFilters/genresFilterChanged" as const,
};

export type GenresFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: readonly string[];
};

export function createGenresFilterChangedAction(
  values: readonly string[],
): GenresFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function genresFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as GenresFilterChangedAction;
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
      if (!filterKey.startsWith("genre-")) return state;
      const slug = filterKey.replace("genre-", "");
      const current = state.pendingFilterValues[STATE_KEY] ?? [];
      const updated = current.filter(
        (g) => g.toLowerCase().replaceAll(" ", "-") !== slug,
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
