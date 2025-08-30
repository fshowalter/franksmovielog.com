import type { ListWithFiltersState } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import type {
  CastAndCrewMemberSort,
  TitleFilterValues,
  TitlesActionType,
} from "~/components/ListWithFilters/titlesReducerUtils";

import {
  createInitialState,
  handleListWithFiltersAction,
  ListWithFiltersActions,
  updatePendingFilter,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  createPaginatedGroupFn,
  createTitleGroupForValue,
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
} from "~/components/utils/reducerUtils";

/**
 * CastAndCrewMember reducer with pending filters support
 */
import type { ListItemValue } from "./CastAndCrewMember";

enum CastAndCrewMemberActions {
  PENDING_FILTER_CREDITED_AS = "PENDING_FILTER_CREDITED_AS",
}

export type CastAndCrewMemberFilterValues = TitleFilterValues & {
  creditedAs?: string;
};

// Re-export sort type for convenience
export type Sort = CastAndCrewMemberSort;

// Re-export actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...TitlesActions,
  ...CastAndCrewMemberActions,
} as const;

export type ActionType = PendingFilterCreditedAsAction | TitlesActionType<Sort>;

// CastAndCrewMember-specific actions
type PendingFilterCreditedAsAction = {
  type: CastAndCrewMemberActions.PENDING_FILTER_CREDITED_AS;
  value: string;
};

type State = ListWithFiltersState<ListItemValue, Sort> & {
  showCount: number;
};

// Create the groupForValue function using the generic builder
const groupForValue = createTitleGroupForValue<ListItemValue, Sort>();

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
    case CastAndCrewMemberActions.PENDING_FILTER_CREDITED_AS: {
      const typedAction = action;
      const filterKey: keyof CastAndCrewMemberFilterValues = "creditedAs";
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.creditedAs.includes(typedAction.value)
          : undefined;
      return {
        ...updatePendingFilter(state, filterKey, filterFn, typedAction.value),
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
