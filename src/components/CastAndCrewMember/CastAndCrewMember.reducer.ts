import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters.reducerUtils";

import {
  buildGroupValues,
  buildSortValues,
  createInitialState,
  getGroupLetter,
  handleGenreFilterAction,
  handleGradeFilterAction,
  handleListWithFiltersAction,
  handleReleaseYearFilterAction,
  handleReviewStatusFilterAction,
  handleReviewYearFilterAction,
  handleTitleFilterAction,
  ListWithFiltersActions,
  sortGrade,
  sortReleaseDate,
  sortReviewDate,
  sortTitle,
  updatePendingFilter,
} from "~/components/ListWithFilters.reducerUtils";

/**
 * CastAndCrewMember reducer with pending filters support
 */
import type { ListItemValue } from "./CastAndCrewMember";

enum CastAndCrewMemberActions {
  PENDING_FILTER_CREDIT_KIND = "PENDING_FILTER_CREDIT_KIND",
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
  ...CastAndCrewMemberActions,
} as const;

export type ActionType =
  | ListWithFiltersActionType<Sort>
  | PendingFilterCreditKindAction;

// CastAndCrewMember-specific actions
type PendingFilterCreditKindAction = {
  type: CastAndCrewMemberActions.PENDING_FILTER_CREDIT_KIND;
  value: string;
};

type State = ListWithFiltersState<ListItemValue, Sort>;

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

const sortValues = buildSortValues<ListItemValue, Sort>({
  ...sortGrade<ListItemValue>(),
  ...sortReleaseDate<ListItemValue>(),
  ...sortReviewDate<ListItemValue>(),
  ...sortTitle<ListItemValue>(),
});

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
    showMoreEnabled: false,
    sortFn: sortValues,
    values,
  });

  return {
    ...baseState,
  };
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case CastAndCrewMemberActions.PENDING_FILTER_CREDIT_KIND: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.creditedAs.includes(typedAction.value)
          : undefined;
      return {
        ...updatePendingFilter(state, "credits", filterFn, typedAction.value),
      };
    }

    // Field-specific shared filters
    case ListWithFiltersActions.PENDING_FILTER_GENRES: {
      return handleGenreFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_GRADE: {
      return handleGradeFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_RELEASE_YEAR: {
      return handleReleaseYearFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_REVIEW_STATUS: {
      return handleReviewStatusFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_REVIEW_YEAR: {
      return handleReviewYearFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_TITLE: {
      return handleTitleFilterAction(state, action);
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
