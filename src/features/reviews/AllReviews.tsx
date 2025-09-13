import { useReducer, useState } from "react";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { ListWithFilters } from "~/components/ListWithFilters/ListWithFilters";
import { GroupedPosterList } from "~/components/PosterList";

import type { Sort } from "./reducer";
import type { ReviewsListItemValue, ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./selectSortedReviewsValues";

import { Filters, SortOptions } from "./Filters";
import {
  Actions,
  createInitialState,
  initState,
  reducer,
  reviewsReducer,
} from "./reducer";
import { ReviewsListItem } from "./ReviewsListItem";

export type AllReviewsProps = {
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: ReviewsSort;
  values: ReviewsValue[];
};

export function AllReviews({
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  values,
}: AllReviewsProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reviewsReducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );
  const [filterKey, setFilterKey] = useState(0);

  return (
    <FilterAndSortContainer
      filters={
        <Filters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          filterValues={state.pendingFilterValues}
          key={filterKey}
        />
      }
      hasActiveFilters={state.hasActiveFilters}
      list={}
      onApplyFilters={() => dispatch({ type: Actions.APPLY_PENDING_FILTERS })}
      onClearFilters={() => {
        dispatch({ type: Actions.CLEAR_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      onFilterDrawerOpen={() =>
        dispatch({ type: Actions.RESET_PENDING_FILTERS })
      }
      onResetFilters={() => {
        dispatch({ type: Actions.RESET_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      pendingFilteredCount={state.pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          }),
        sortOptions: <SortOptions />,
      }}
      totalCount={state.filteredValues.length}
    >
      <GroupedPosterList
        groupedValues={state.groupedValues}
        onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
        totalCount={state.filteredValues.length}
        visibleCount={state.showCount}
      >
        {(value) => <ReviewsListItem key={value.imdbId} value={value} />}
      </GroupedPosterList>
    </FilterAndSortContainer>
  );
}
