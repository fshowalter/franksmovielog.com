import {
  applyPendingFilters,
  buildGroupValues,
  clearPendingFilters,
  createInitialState,
  getGroupLetter,
  handlePendingFilterReleaseYear,
  handlePendingFilterReviewYear,
  handlePendingFilterTitle,
  ListWithFiltersActions,
  type ListWithFiltersState,
  resetPendingFilters,
  showMore,
  sortNumber,
  sortString,
  updateSort,
} from "~/components/ListWithFilters.reducerUtils";

/**
 * Collection reducer with pending filters support
 */
import type { ListItemValue } from "./Collection";

export type Sort =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc";

const SHOW_COUNT_DEFAULT = 100;

export enum Actions {
  APPLY_PENDING_FILTERS = ListWithFiltersActions.APPLY_PENDING_FILTERS,
  CLEAR_PENDING_FILTERS = ListWithFiltersActions.CLEAR_PENDING_FILTERS,
  PENDING_FILTER_RELEASE_YEAR = "PENDING_FILTER_RELEASE_YEAR",
  PENDING_FILTER_REVIEW_YEAR = "PENDING_FILTER_REVIEW_YEAR",
  PENDING_FILTER_TITLE = "PENDING_FILTER_TITLE",
  RESET_PENDING_FILTERS = ListWithFiltersActions.RESET_PENDING_FILTERS,
  SHOW_MORE = ListWithFiltersActions.SHOW_MORE,
  SORT = ListWithFiltersActions.SORT,
  TOGGLE_REVIEWED = "TOGGLE_REVIEWED",
}

export type ActionType =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | PendingFilterReleaseYearAction
  | PendingFilterReviewYearAction
  | PendingFilterTitleAction
  | ResetPendingFiltersAction
  | ShowMoreAction
  | SortAction
  | ToggleReviewedAction;

type ApplyPendingFiltersAction = {
  type: Actions.APPLY_PENDING_FILTERS;
};

type ClearPendingFiltersAction = {
  type: Actions.CLEAR_PENDING_FILTERS;
};

type PendingFilterReleaseYearAction = {
  type: Actions.PENDING_FILTER_RELEASE_YEAR;
  values: [string, string];
};

type PendingFilterReviewYearAction = {
  type: Actions.PENDING_FILTER_REVIEW_YEAR;
  values: [string, string];
};

type PendingFilterTitleAction = {
  type: Actions.PENDING_FILTER_TITLE;
  value: string;
};

type ResetPendingFiltersAction = {
  type: Actions.RESET_PENDING_FILTERS;
};

type ShowMoreAction = {
  type: Actions.SHOW_MORE;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type State = ListWithFiltersState<ListItemValue, Sort> & {
  hideReviewed: boolean;
};

type ToggleReviewedAction = {
  type: Actions.TOGGLE_REVIEWED;
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
    case Actions.APPLY_PENDING_FILTERS: {
      return {
        ...applyPendingFilters(state, sortValues, groupValues),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.CLEAR_PENDING_FILTERS: {
      return {
        ...clearPendingFilters(state),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.PENDING_FILTER_RELEASE_YEAR: {
      return handlePendingFilterReleaseYear(state, action.values, {
        hideReviewed: state.hideReviewed,
      });
    }

    case Actions.PENDING_FILTER_REVIEW_YEAR: {
      return handlePendingFilterReviewYear(state, action.values, {
        hideReviewed: state.hideReviewed,
      });
    }

    case Actions.PENDING_FILTER_TITLE: {
      return handlePendingFilterTitle(state, action.value, {
        hideReviewed: state.hideReviewed,
      });
    }

    case Actions.RESET_PENDING_FILTERS: {
      return {
        ...resetPendingFilters(state),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.SHOW_MORE: {
      return {
        ...showMore(state, SHOW_COUNT_DEFAULT, groupValues),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.SORT: {
      return {
        ...updateSort(state, action.value, sortValues, groupValues),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.TOGGLE_REVIEWED: {
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

    // no default
  }
}
