import { useReducer } from "react";

import { FilterAndSortContainer } from "~/components/filter-and-sort/container/FilterAndSortContainer";
import { PaginatedList } from "~/components/filter-and-sort/paginated-list/PaginatedList";
import { PosterList } from "~/components/poster-list/PosterList";
import { usePaginatedValues } from "~/hooks/usePaginatedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { ReviewsProps } from "./ReviewsProps";

import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { filterReviews } from "./filterReviews";
import { ReviewsFilters } from "./ReviewsFilters";
import { ReviewsListItem } from "./ReviewsListItem";
import { createInitialState, reducer } from "./reviewsReducer";
import { sortOptions, sortReviews } from "./sortReviews";

export function Reviews({
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  values,
}: ReviewsProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );

  const [paginatedValues, totalCount] = usePaginatedValues(
    sortReviews,
    filterReviews,
    state.values,
    state.sort,
    state.activeFilterValues,
    state.showCount,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterReviews,
    state.values,
    state.pendingFilterValues,
  );

  const activeFilters = buildAppliedFilterChips(state.activeFilterValues);

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      dispatch={dispatch}
      filters={
        <ReviewsFilters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          filterValues={state.pendingFilterValues}
          values={values}
        />
      }
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        sortOptions,
      }}
      state={state}
      totalCount={totalCount}
    >
      <PaginatedList
        dispatch={dispatch}
        totalCount={totalCount}
        visibleCount={paginatedValues.length}
      >
        <PosterList>
          {[...paginatedValues].map((value) => {
            return <ReviewsListItem key={value.imdbId} value={value} />;
          })}
        </PosterList>
      </PaginatedList>
    </FilterAndSortContainer>
  );
}
