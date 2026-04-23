import type { RemoveFilterAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/filter-and-sort/facets/omitPendingKey";

const ActionTypes = {
  CHANGED: "venue/changed" as const,
};

export const STATE_KEY = "venue";

export type VenueFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: readonly string[];
};

export function createVenueFilterChangedAction(
  values: readonly string[],
): VenueFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function venueFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as VenueFilterChangedAction;
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
    case FilterAndSortContainerActionTypes.FILTER_REMOVED: {
      const { key, value } = action as RemoveFilterAction;
      if (key !== STATE_KEY) return state;
      const current = state.pendingFilterValues[STATE_KEY] ?? [];
      const updated = current.filter((k) => k !== value);
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
