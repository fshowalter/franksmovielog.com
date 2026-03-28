import { omitPendingKey } from "~/facets/omitPendingKey";

const STATE_KEY = "gradeValue";

const GRADE_MIN = 2;
const GRADE_MAX = 16;

const ActionTypes = {
  CHANGED: "grade/changed" as const,
};

export type GradeFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: [number, number];
};

export function createGradeFilterChangedAction(
  values: [number, number],
): GradeFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function gradeFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: [number, number] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as GradeFilterChangedAction;
      if (values[0] === GRADE_MIN && values[1] === GRADE_MAX) {
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
