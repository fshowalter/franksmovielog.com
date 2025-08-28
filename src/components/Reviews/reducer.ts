/**
 * Reviews reducer with pending filters support
 */
import type { ListWithFiltersState } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import type { TitlesActionType } from "~/components/ListWithFilters/titlesReducerUtils";
import type { ReviewsListItemValue } from "~/components/Reviews/ReviewsListItem";

import { createInitialState } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  handleGenreFilterAction,
  handleGradeFilterAction,
  handleReleaseYearFilterAction,
  handleReviewYearFilterAction,
  handleTitleFilterAction,
  handleTitlesListAction,
  SHOW_COUNT_DEFAULT,
  sortGrade,
  sortReleaseDate,
  sortReviewDate,
  sortTitle,
  TitlesActions,
} from "~/components/ListWithFilters/titlesReducerUtils";
import {
  buildGroupValues,
  buildSortValues,
  getGroupLetter,
} from "~/utils/reducerUtils";

type ReviewsSort =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc";

// Re-export actions for component convenience
import { ListWithFiltersActions } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";

export const Actions = {
  ...ListWithFiltersActions,
  ...TitlesActions,
} as const;

export type ActionType = TitlesActionType<ReviewsSort>;

// Re-export sort type for convenience
export type Sort = ReviewsSort;

type State = ListWithFiltersState<ReviewsListItemValue, ReviewsSort> & {
  showCount: number;
};

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

const sortValues = buildSortValues<ReviewsListItemValue, ReviewsSort>({
  ...sortGrade<ReviewsListItemValue>(),
  ...sortReleaseDate<ReviewsListItemValue>(),
  ...sortReviewDate<ReviewsListItemValue>(),
  ...sortTitle<ReviewsListItemValue>(),
});

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
  const showCount = SHOW_COUNT_DEFAULT;
  return createInitialState({
    extendedState: {
      showCount,
    },
    groupFn: groupValues,
    initialSort,
    showCount,
    sortFn: sortValues,
    values,
  });
}

// Create reducer function
export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    // Field-specific shared filters
    case TitlesActions.PENDING_FILTER_GENRES: {
      return handleGenreFilterAction(state, action, {
        showCount: state.showCount,
      });
    }

    case TitlesActions.PENDING_FILTER_GRADE: {
      return handleGradeFilterAction(state, action, {
        showCount: state.showCount,
      });
    }

    case TitlesActions.PENDING_FILTER_RELEASE_YEAR: {
      return handleReleaseYearFilterAction(state, action, {
        showCount: state.showCount,
      });
    }

    case TitlesActions.PENDING_FILTER_REVIEW_YEAR: {
      return handleReviewYearFilterAction(state, action, {
        showCount: state.showCount,
      });
    }

    case TitlesActions.PENDING_FILTER_TITLE: {
      return handleTitleFilterAction(state, action, {
        showCount: state.showCount,
      });
    }

    default: {
      // Handle shared list structure actions
      return handleTitlesListAction(
        state,
        action,
        {
          groupFn: groupValues,
          sortFn: sortValues,
        },
        { showCount: state.showCount },
      );
    }
  }
}
