/**
 * Reviews reducer with pending filters support
 */
import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters.reducerUtils";
import type { ReviewsListItemValue } from "~/components/Reviews/ReviewsListItem";

import {
  buildGroupValues,
  createInitialState,
  getGroupLetter,
  handleGenreFilterAction,
  handleListWithFiltersAction,
  handleReleaseYearFilterAction,
  handleReviewYearFilterAction,
  handleTitleFilterAction,
  ListWithFiltersActions,
  sortGrade,
  sortReleaseDate,
  sortReviewDate,
  sortTitle,
  updatePendingFilter,
} from "~/components/ListWithFilters.reducerUtils";

enum ReviewsActions {
  PENDING_FILTER_GRADE = "PENDING_FILTER_GRADE",
}

type ReviewsSort =
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
  ...ReviewsActions,
} as const;

export type ActionType =
  | ListWithFiltersActionType<ReviewsSort>
  | PendingFilterGradeAction;

// Re-export sort type for convenience
export type Sort = ReviewsSort;

// Grade filter is specific to Reviews
type PendingFilterGradeAction = {
  type: ReviewsActions.PENDING_FILTER_GRADE;
  values: [number, number];
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
    ...sortGrade<ReviewsListItemValue>(),
    ...sortReleaseDate<ReviewsListItemValue>(),
    ...sortReviewDate<ReviewsListItemValue>(),
    ...sortTitle<ReviewsListItemValue>(),
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
    sortFn: sortValues,
    values,
  });
}

// Create reducer function
export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    // Field-specific shared filters
    case ListWithFiltersActions.PENDING_FILTER_GENRES: {
      return handleGenreFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_RELEASE_YEAR: {
      return handleReleaseYearFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_REVIEW_YEAR: {
      return handleReviewYearFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_TITLE: {
      return handleTitleFilterAction(state, action);
    }

    case ReviewsActions.PENDING_FILTER_GRADE: {
      const typedAction = action;
      const filterFn = (value: ReviewsListItemValue) =>
        value.gradeValue >= typedAction.values[0] &&
        value.gradeValue <= typedAction.values[1];
      return updatePendingFilter(state, "grade", filterFn, typedAction.values);
    }

    default: {
      // Handle shared list structure actions
      return handleListWithFiltersAction(state, action, {
        groupFn: groupValues,
        sortFn: sortValues,
      });
    }
  }
}
