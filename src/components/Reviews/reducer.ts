/**
 * Reviews reducer with pending filters support
 */
import type { ListWithFiltersActionType } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import type {
  TitlesActionType,
  TitlesListState,
  TitleSortType,
} from "~/components/ListWithFilters/titlesReducerUtils";
import type { ReviewsListItemValue } from "~/components/Reviews/ReviewsListItem";

import {
  createInitialState,
  handleListWithFiltersAction,
  ListWithFiltersActions,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  createPaginatedGroupFn,
  createTitleGroupForValue,
  handleGenreFilterAction,
  handleGradeFilterAction,
  handleReleaseYearFilterAction,
  handleReviewYearFilterAction,
  handleShowMoreAction,
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
} from "~/components/utils/reducerUtils";

// Re-export actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...TitlesActions,
} as const;

export type ActionType = Extract<
  TitlesActionType,
  | ListWithFiltersActionType<TitleSortType>
  | { type: TitlesActions.PENDING_FILTER_GENRES }
  | { type: TitlesActions.PENDING_FILTER_GRADE }
  | { type: TitlesActions.PENDING_FILTER_RELEASE_YEAR }
  | { type: TitlesActions.PENDING_FILTER_REVIEW_YEAR }
  | { type: TitlesActions.PENDING_FILTER_TITLE }
  | { type: TitlesActions.SHOW_MORE }
>;

// Re-export sort type for convenience
export type Sort = TitleSortType;

type State = TitlesListState<ReviewsListItemValue, TitleSortType> & {
  showCount: number;
};

// Create the groupForValue function using the generic builder
const groupForValue = createTitleGroupForValue<
  ReviewsListItemValue,
  TitleSortType
>();

const sortValues = buildSortValues<ReviewsListItemValue, TitleSortType>({
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
  initialSort: TitleSortType;
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
  }) as State;
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
    case TitlesActions.SHOW_MORE: {
      return handleShowMoreAction(state, action, groupValues);
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
