/**
 * Reviews reducer with pending filters support
 */
import type { ReviewsListItemValue } from "~/components/Reviews/ReviewsListItem";

import {
  applyPendingFilters,
  buildGroupValues,
  clearPendingFilters,
  createInitialState,
  createReleaseYearFilter,
  createTitleFilter,
  getGroupLetter,
  ListWithFiltersActions,
  type ListWithFiltersState,
  resetPendingFilters,
  showMore,
  sortNumber,
  sortString,
  updatePendingFilter,
  updateSort,
} from "~/components/ListWithFilters.reducerUtils";

const SHOW_COUNT_DEFAULT = 100;

type ReviewsSort =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc";

export const Actions = {
  APPLY_PENDING_FILTERS: ListWithFiltersActions.APPLY_PENDING_FILTERS,
  CLEAR_PENDING_FILTERS: ListWithFiltersActions.CLEAR_PENDING_FILTERS,
  PENDING_FILTER_GENRES: "PENDING_FILTER_GENRES",
  PENDING_FILTER_GRADE: "PENDING_FILTER_GRADE",
  PENDING_FILTER_RELEASE_YEAR: "PENDING_FILTER_RELEASE_YEAR",
  PENDING_FILTER_REVIEW_YEAR: "PENDING_FILTER_REVIEW_YEAR",
  PENDING_FILTER_TITLE: "PENDING_FILTER_TITLE",
  RESET_PENDING_FILTERS: ListWithFiltersActions.RESET_PENDING_FILTERS,
  SHOW_MORE: ListWithFiltersActions.SHOW_MORE,
  SORT: ListWithFiltersActions.SORT,
} as const;

export type ActionType =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | PendingFilterGenresAction
  | PendingFilterGradeAction
  | PendingFilterReleaseYearAction
  | PendingFilterReviewYearAction
  | PendingFilterTitleAction
  | ResetPendingFiltersAction
  | ShowMoreAction
  | SortAction;

// Re-export sort type for convenience
export type Sort = ReviewsSort;

type ApplyPendingFiltersAction = {
  type: typeof Actions.APPLY_PENDING_FILTERS;
};

type ClearPendingFiltersAction = {
  type: typeof Actions.CLEAR_PENDING_FILTERS;
};

type PendingFilterGenresAction = {
  type: typeof Actions.PENDING_FILTER_GENRES;
  values: readonly string[];
};

type PendingFilterGradeAction = {
  type: typeof Actions.PENDING_FILTER_GRADE;
  values: [number, number];
};

type PendingFilterReleaseYearAction = {
  type: typeof Actions.PENDING_FILTER_RELEASE_YEAR;
  values: [string, string];
};

type PendingFilterReviewYearAction = {
  type: typeof Actions.PENDING_FILTER_REVIEW_YEAR;
  values: [string, string];
};

type PendingFilterTitleAction = {
  type: typeof Actions.PENDING_FILTER_TITLE;
  value: string;
};

type ResetPendingFiltersAction = {
  type: typeof Actions.RESET_PENDING_FILTERS;
};

type ShowMoreAction = {
  type: typeof Actions.SHOW_MORE;
};

type SortAction = {
  type: typeof Actions.SORT;
  value: ReviewsSort;
};

type State = ListWithFiltersState<ReviewsListItemValue, ReviewsSort>;

// Helper functions
function getReviewDateGroup(value: ReviewsListItemValue): string {
  if (value.reviewMonth) {
    return `${value.reviewMonth} ${value.reviewYear}`;
  }
  return value.reviewYear;
}

function groupForValue(
  value: ReviewsListItemValue,
  sortValue: ReviewsSort,
): string {
  switch (sortValue) {
    case "grade-asc":
    case "grade-desc": {
      return value.grade;
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
  }
}

function sortValues(
  values: ReviewsListItemValue[],
  sortOrder: ReviewsSort,
): ReviewsListItemValue[] {
  const sortMap: Record<
    ReviewsSort,
    (a: ReviewsListItemValue, b: ReviewsListItemValue) => number
  > = {
    "grade-asc": (a, b) => sortNumber(a.gradeValue, b.gradeValue),
    "grade-desc": (a, b) => sortNumber(a.gradeValue, b.gradeValue) * -1,
    "release-date-asc": (a, b) =>
      sortString(a.releaseSequence, b.releaseSequence),
    "release-date-desc": (a, b) =>
      sortString(a.releaseSequence, b.releaseSequence) * -1,
    "review-date-asc": (a, b) => sortString(a.reviewSequence, b.reviewSequence),
    "review-date-desc": (a, b) =>
      sortString(a.reviewSequence, b.reviewSequence) * -1,
    "title-asc": (a, b) => sortString(a.sortTitle, b.sortTitle),
    "title-desc": (a, b) => sortString(a.sortTitle, b.sortTitle) * -1,
  };

  const comparer = sortMap[sortOrder];
  return [...values].sort(comparer);
}

// Create groupValues function using buildGroupValues
const groupValues = buildGroupValues(groupForValue);

// Create initState function
export function initState({
  initialSort,
  values,
}: {
  initialSort: ReviewsSort;
  values: ReviewsListItemValue[];
}): State {
  return createInitialState({
    groupFn: groupValues,
    initialSort,
    showCount: SHOW_COUNT_DEFAULT,
    sortFn: sortValues,
    values,
  });
}

// Create reducer function
export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case Actions.APPLY_PENDING_FILTERS: {
      return applyPendingFilters(state, sortValues, groupValues);
    }

    case Actions.CLEAR_PENDING_FILTERS: {
      return clearPendingFilters(state);
    }

    case Actions.PENDING_FILTER_GENRES: {
      const filterFn =
        action.values.length > 0
          ? (value: ReviewsListItemValue) =>
              action.values.every((genre) => value.genres.includes(genre))
          : undefined;
      return updatePendingFilter(state, "genres", filterFn, action.values);
    }

    case Actions.PENDING_FILTER_GRADE: {
      const filterFn = (value: ReviewsListItemValue) =>
        value.gradeValue >= action.values[0] &&
        value.gradeValue <= action.values[1];
      return updatePendingFilter(state, "grade", filterFn, action.values);
    }

    case Actions.PENDING_FILTER_RELEASE_YEAR: {
      const filterFn = action.values[0]
        ? createReleaseYearFilter(action.values[0], action.values[1])
        : undefined;
      return updatePendingFilter(state, "releaseYear", filterFn, action.values);
    }

    case Actions.PENDING_FILTER_REVIEW_YEAR: {
      const filterFn = action.values[0]
        ? (value: ReviewsListItemValue) => {
            const year = value.reviewSequence.slice(0, 4);
            return year >= action.values[0] && year <= action.values[1];
          }
        : undefined;
      return updatePendingFilter(state, "reviewYear", filterFn, action.values);
    }

    case Actions.PENDING_FILTER_TITLE: {
      const filterFn = action.value
        ? createTitleFilter(action.value)
        : undefined;
      return updatePendingFilter(state, "title", filterFn, action.value);
    }

    case Actions.RESET_PENDING_FILTERS: {
      return resetPendingFilters(state);
    }

    case Actions.SHOW_MORE: {
      return showMore(state, SHOW_COUNT_DEFAULT, groupValues);
    }

    case Actions.SORT: {
      return updateSort(state, action.value, sortValues, groupValues);
    }

    // no default
  }
}
