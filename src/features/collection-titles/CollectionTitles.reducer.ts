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

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesSort } from "./sortCollectionTitles";

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
export type CollectionTitlesAction =
  | MaybeReviewedTitleFiltersAction
  | ShowMoreAction
  | SortAction<CollectionTitlesSort>;

export type CollectionTitlesFiltersValues = MaybeReviewedTitleFiltersValues;

type CollectionTitlesState = Omit<
  MaybeReviewedTitleFiltersState<CollectionTitlesValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  ShowMoreState &
  SortState<CollectionTitlesSort> & {
    activeFilterValues: CollectionTitlesFiltersValues;
    pendingFilterValues: CollectionTitlesFiltersValues;
  };

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: CollectionTitlesSort;
  values: CollectionTitlesValue[];
}): CollectionTitlesState {
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
  state: CollectionTitlesState,
  action: CollectionTitlesAction,
) {
  switch (action.type) {
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

export const createSortAction = createSortActionCreator<CollectionTitlesSort>();
