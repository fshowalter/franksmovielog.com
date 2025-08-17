import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters.reducerUtils";

import {
  buildGroupValues,
  createInitialState,
  getGroupLetter,
  handleListWithFiltersAction,
  ListWithFiltersActions,
  SHOW_COUNT_DEFAULT,
  sortNumber,
  sortString,
} from "~/components/ListWithFilters.reducerUtils";

/**
 * Collection reducer with pending filters support
 */
import type { ListItemValue } from "./Collection";

export enum CollectionActions {
  TOGGLE_REVIEWED = "TOGGLE_REVIEWED",
}

export type Sort =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc";

// Re-export shared actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...CollectionActions,
} as const;

export type ActionType =
  | ListWithFiltersActionType<Sort>
  | ToggleReviewedAction;

type State = ListWithFiltersState<ListItemValue, Sort> & {
  hideReviewed: boolean;
};

type ToggleReviewedAction = {
  type: CollectionActions.TOGGLE_REVIEWED;
};

// Helper functions
function getReviewDateGroup(value: ListItemValue): string {
  return value.reviewYear || "Unreviewed";
}

function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "grade-asc":
    case "grade-desc": {
      return value.grade || "Unreviewed";
    }
    case "release-date-asc":
    case "release-date-desc": {
      return value.releaseYear;
    }
    case "review-date-asc":
    case "review-date-desc": {
      return getReviewDateGroup(value);
    }
    case "title-asc":
    case "title-desc": {
      return getGroupLetter(value.sortTitle);
    }
    // no default
  }
}

function sortValues(values: ListItemValue[], sortOrder: Sort): ListItemValue[] {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "grade-asc": (a, b) => sortNumber(a.gradeValue || 0, b.gradeValue || 0),
      "grade-desc": (a, b) =>
        sortNumber(a.gradeValue || 0, b.gradeValue || 0) * -1,
      "release-date-asc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence),
      "release-date-desc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence) * -1,
      "review-date-asc": (a, b) =>
        sortString(a.reviewSequence || "", b.reviewSequence || ""),
      "review-date-desc": (a, b) =>
        sortString(a.reviewSequence || "", b.reviewSequence || "") * -1,
      "title-asc": (a, b) => sortString(a.sortTitle, b.sortTitle),
      "title-desc": (a, b) => sortString(a.sortTitle, b.sortTitle) * -1,
    };

  const comparer = sortMap[sortOrder];
  return [...values].sort(comparer);
}

const groupValues = buildGroupValues(groupForValue);

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  const baseState = createInitialState({
    groupFn: groupValues,
    initialSort,
    showCount: SHOW_COUNT_DEFAULT,
    sortFn: sortValues,
    values,
  });

  return {
    ...baseState,
    hideReviewed: false,
  };
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case CollectionActions.TOGGLE_REVIEWED: {
      const hideReviewed = !state.hideReviewed;
      const filters = hideReviewed
        ? {
            ...state.filters,
            hideReviewed: (value: ListItemValue) => !value.slug,
          }
        : (() => {
            const newFilters = { ...state.filters };
            delete newFilters.hideReviewed;
            return newFilters;
          })();

      const pendingFilters = hideReviewed
        ? {
            ...state.pendingFilters,
            hideReviewed: (value: ListItemValue) => !value.slug,
          }
        : (() => {
            const newFilters = { ...state.pendingFilters };
            delete newFilters.hideReviewed;
            return newFilters;
          })();

      const filteredValues = sortValues(
        [...state.allValues].filter((value) => {
          for (const filter of Object.values(filters)) {
            if (!filter(value)) {
              return false;
            }
          }
          return true;
        }),
        state.sortValue,
      );

      const pendingFilteredCount = state.allValues.filter((value) => {
        for (const filter of Object.values(pendingFilters)) {
          if (!filter(value)) {
            return false;
          }
        }
        return true;
      }).length;

      return {
        ...state,
        filteredValues,
        filters,
        groupedValues: groupValues(
          state.showCount
            ? filteredValues.slice(0, state.showCount)
            : filteredValues,
          state.sortValue,
        ),
        hideReviewed,
        pendingFilteredCount,
        pendingFilters,
      };
    }

    default: {
      // Handle shared actions
      return handleListWithFiltersAction(
        state,
        action,
        { groupFn: groupValues, sortFn: sortValues },
        { hideReviewed: state.hideReviewed },
      );
    }
  }
}
