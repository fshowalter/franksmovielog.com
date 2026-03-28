import { omitPendingKey } from "~/facets/omitPendingKey";

// AIDEV-NOTE: This facet handles the watchlist "collection" filter (multi-select).
// Not to be confused with the Collections feature (Stage 5), which uses nameFacetReducer.
const STATE_KEY = "collection";

const ActionTypes = {
  CHANGED: "collection/changed" as const,
};

export type CollectionFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: readonly string[];
};

export function collectionFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as CollectionFilterChangedAction;
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
      if (!filterKey.startsWith("collection-")) return state;
      const slug = filterKey.replace("collection-", "");
      const current = state.pendingFilterValues[STATE_KEY] ?? [];
      const updated = current.filter(
        (c) => c.toLowerCase().replaceAll(" ", "-") !== slug,
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

export function createCollectionFilterChangedAction(
  values: readonly string[],
): CollectionFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}
