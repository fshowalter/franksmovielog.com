import type { RemoveFilterAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/filter-and-sort/facets/omitPendingKey";

export const STATE_KEY = "viewingYear";

const ActionTypes = {
  CHANGED: "viewingYear/changed" as const,
};

export type ViewingYearFilterChangedAction = {
  availableMax: string;
  availableMin: string;
  type: typeof ActionTypes.CHANGED;
  values: [string, string];
};

export function createViewingYearFilterChangedAction(
  values: [string, string],
  availableMin: string,
  availableMax: string,
): ViewingYearFilterChangedAction {
  return { availableMax, availableMin, type: ActionTypes.CHANGED, values };
}

export function viewingYearFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { availableMax, availableMin, values } =
        action as ViewingYearFilterChangedAction;
      if (values[0] === availableMin && values[1] === availableMax) {
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
      const { key } = action as RemoveFilterAction;
      if (key !== STATE_KEY) return state;
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
