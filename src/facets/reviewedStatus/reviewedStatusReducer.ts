import { omitPendingKey } from "~/facets/omitPendingKey";

export const STATE_KEY = "reviewedStatus";

const ActionTypes = {
  CHANGED: "maybeReviewedTitleFilters/reviewedStatusFilterChanged" as const,
};

export type ReviewedStatusFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: readonly string[];
};

export function createReviewedStatusFilterChangedAction(
  values: readonly string[],
): ReviewedStatusFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function reviewedStatusFacetReducer<
  TState extends {
    pendingFilterValues: { [STATE_KEY]?: readonly string[] };
  },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as ReviewedStatusFilterChangedAction;
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
      if (!filterKey.startsWith("reviewedStatus-")) return state;
      // Convert slug back to status value: "reviewedStatus-not-reviewed" → "Not Reviewed"
      const slug = filterKey.replace(/^reviewedStatus-/, "");
      const statusValue = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const current = state.pendingFilterValues[STATE_KEY] ?? [];
      const updated = current.filter((s) => s !== statusValue);
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
