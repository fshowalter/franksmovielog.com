import type {
  ReviewedTitleFiltersAction,
  ReviewedTitleFiltersState,
  ReviewedTitleFiltersValues,
} from "~/reducers/reviewedTitleFiltersReducer";
import type { ShowMoreAction, ShowMoreState } from "~/reducers/showMoreReducer";
import type { SortAction, SortState } from "~/reducers/sortReducer";

import {
  createInitialReviewedTitleFiltersState,
  reviewedTitleFiltersReducer,
} from "~/reducers/reviewedTitleFiltersReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/reducers/showMoreReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createResetFiltersAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
} from "~/reducers/reviewedTitleFiltersReducer";

export { createShowMoreAction } from "~/reducers/showMoreReducer";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type ReviewsAction =
  | ReviewedTitleFiltersAction
  | ShowMoreAction
  | SortAction<ReviewsSort>;

import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./selectSortedReviewsValues";

/**
 * Type definition for Reviews page filter values
 */
export type ReviewsFiltersValues = ReviewedTitleFiltersValues;

/**
 * Internal state type for Reviews page reducer
 */
type ReviewsState = Omit<
  ReviewedTitleFiltersState<ReviewsValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  ShowMoreState &
  SortState<ReviewsSort> & {
    activeFilterValues: ReviewsFiltersValues;
    pendingFilterValues: ReviewsFiltersValues;
  };

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: ReviewsSort;
  values: ReviewsValue[];
}): ReviewsState {
  const showMoreState = createInitialShowMoreState();
  const sortState = createInitialSortState({ initialSort });
  const reviewedTitleFilterState = createInitialReviewedTitleFiltersState({
    values,
  });

  return {
    ...reviewedTitleFilterState,
    ...showMoreState,
    ...sortState,
  };
}

export function reviewsReducer(state: ReviewsState, action: ReviewsAction) {
  switch (action.type) {
    case "showMore/showMore": {
      return showMoreReducer(state, action);
    }
    case "sort/sort": {
      return sortReducer(state, action);
    }
    default: {
      return reviewedTitleFiltersReducer(state, action);
    }
  }
}

/**
 * Action creator for sort actions specific to the Watchlist page.
 */
export const createSortAction = createSortActionCreator<ReviewsSort>();
