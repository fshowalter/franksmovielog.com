import type {
  MaybeReviewedTitleFiltersAction,
  MaybeReviewedTitleFiltersState,
  MaybeReviewedTitleFiltersValues,
} from "~/reducers/maybeReviewedTitleFiltersReducer";
import type { ShowMoreAction, ShowMoreState } from "~/reducers/showMoreReducer";
import type { SortAction, SortState } from "~/reducers/sortReducer";

import {
  createInitialMaybeReviewedTitleFiltersState,
  maybeReviewedTitleFiltersReducer,
} from "~/reducers/maybeReviewedTitleFiltersReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/reducers/showMoreReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createResetFiltersAction,
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
  selectHasPendingFilters,
} from "~/reducers/maybeReviewedTitleFiltersReducer";

export { createShowMoreAction } from "~/reducers/showMoreReducer";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type CastAndCrewMemberTitlesAction =
  | CreditedAsFilterChangedAction
  | MaybeReviewedTitleFiltersAction
  | ShowMoreAction
  | SortAction<CastAndCrewMemberTitlesSort>;

export type CastAndCrewMemberTitlesFiltersValues =
  MaybeReviewedTitleFiltersValues & {
    creditedAs?: string;
  };

/**
 * Internal state type for Reviews page reducer
 */
type CastAndCrewMemberTitlesState = Omit<
  MaybeReviewedTitleFiltersState<CastAndCrewMemberTitlesValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  ShowMoreState &
  SortState<CastAndCrewMemberTitlesSort> & {
    activeFilterValues: CastAndCrewMemberTitlesFiltersValues;
    pendingFilterValues: CastAndCrewMemberTitlesFiltersValues;
  };

type CreditedAsFilterChangedAction = {
  type: "castAndCrewMemberTitles/creditedAsFilterChanged";
  value: string;
};

export function createCreditedAsFilterChangedAction(
  value: string,
): CreditedAsFilterChangedAction {
  return { type: "castAndCrewMemberTitles/creditedAsFilterChanged", value };
}

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CastAndCrewMemberTitlesSort;
  values: CastAndCrewMemberTitlesValue[];
}): CastAndCrewMemberTitlesState {
  const showMoreState = createInitialShowMoreState();
  const sortState = createInitialSortState({ initialSort });
  const reviewedTitleFilterState = createInitialMaybeReviewedTitleFiltersState({
    values,
  });

  return {
    ...reviewedTitleFilterState,
    ...showMoreState,
    ...sortState,
  };
}

export function reducer(
  state: CastAndCrewMemberTitlesState,
  action: CastAndCrewMemberTitlesAction,
) {
  switch (action.type) {
    case "castAndCrewMemberTitles/creditedAsFilterChanged": {
      return handleCreditedAsFilterChanged(state, action);
    }
    case "showMore/showMore": {
      return showMoreReducer(state, action);
    }
    case "sort/sort": {
      return sortReducer(state, action);
    }
    default: {
      return maybeReviewedTitleFiltersReducer(state, action);
    }
  }
}

function handleCreditedAsFilterChanged(
  state: CastAndCrewMemberTitlesState,
  action: CreditedAsFilterChangedAction,
): CastAndCrewMemberTitlesState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      creditedAs: action.value,
    },
  };
}

export const createSortAction =
  createSortActionCreator<CastAndCrewMemberTitlesSort>();
