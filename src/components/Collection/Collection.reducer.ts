import type { ListWithFiltersState } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import type { TitlesActionType } from "~/components/ListWithFilters/titlesReducerUtils";

import {
  createInitialState,
  handleListWithFiltersAction,
  ListWithFiltersActions,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  createPaginatedGroupFn,
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
} from "~/utils/reducerUtils";

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

// Re-export actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...TitlesActions,
} as const;

export type ActionType = Extract<
  TitlesActionType<Sort>,
  | { type: TitlesActions.PENDING_FILTER_RELEASE_YEAR }
  | { type: TitlesActions.PENDING_FILTER_REVIEW_STATUS }
  | { type: TitlesActions.PENDING_FILTER_REVIEW_YEAR }
  | { type: TitlesActions.PENDING_FILTER_TITLE }
  | { type: TitlesActions.SHOW_MORE }
  | { type: ListWithFiltersActions.APPLY_PENDING_FILTERS }
  | { type: ListWithFiltersActions.CLEAR_PENDING_FILTERS }
  | { type: ListWithFiltersActions.RESET_PENDING_FILTERS }
  | { type: ListWithFiltersActions.SORT }
>;

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
