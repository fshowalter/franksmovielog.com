import type { ListWithFiltersState } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import type { TitlesActionType } from "~/components/ListWithFilters/titlesReducerUtils";

import {
  createInitialState,
  handleListWithFiltersAction,
  ListWithFiltersActions,
  updatePendingFilter,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  createPaginatedGroupFn,
  handleGenreFilterAction,
  handleGradeFilterAction,
  handleReleaseYearFilterAction,
  handleReviewStatusFilterAction,
  handleReviewYearFilterAction,
  handleShowMore,
  handleTitleFilterAction,
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
} from "~/components/utils/reducerUtils";

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

// Re-export actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...TitlesActions,
  ...CastAndCrewMemberActions,
} as const;

export type ActionType = PendingFilterCreditKindAction | TitlesActionType<Sort>;

// CastAndCrewMember-specific actions
type PendingFilterCreditKindAction = {
  type: CastAndCrewMemberActions.PENDING_FILTER_CREDIT_KIND;
  value: string;
};

type State = ListWithFiltersState<ListItemValue, Sort> & {
  showCount: number;
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
  const showCount = SHOW_COUNT_DEFAULT;
  const baseState = createInitialState({
    extendedState: {
      showCount,
    },
    groupFn: groupValues,
    initialSort,
    showCount,
    sortFn: sortValues,
    values,
  });

  return baseState;
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
        showCount: state.showCount,
      };
    }

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

    case TitlesActions.PENDING_FILTER_REVIEW_STATUS: {
      return handleReviewStatusFilterAction(state, action, {
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
    case TitlesActions.SHOW_MORE: {
      return handleShowMore(state, action, groupValues);
    }

    default: {
      // Handle shared list structure actions
      const paginatedGroupFn = createPaginatedGroupFn(
        groupValues,
        state.showCount,
      );
      return handleListWithFiltersAction(
        state,
        action,
        {
          groupFn: paginatedGroupFn,
          sortFn: sortValues,
        },
        { showCount: state.showCount },
      );
    }
  }
}
