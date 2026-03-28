import { useReducer } from "react";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { PosterList } from "~/components/poster-list/PosterList";
import { usePaginatedValues } from "~/hooks/usePaginatedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { ReviewsProps } from "./ReviewsProps";

import { buildAppliedFilterChips } from "./appliedFilterChips";
import { filterReviews } from "./filteredReviews";
import {
  createInitialState,
  createShowMoreAction,
  createSortAction,
  reducer,
} from "./reducer";
import { ReviewsFilters, SORT_OPTIONS } from "./ReviewsFilters";
import { ReviewsListItem } from "./ReviewsListItem";
import { sortReviews } from "./sortReviews";

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

  // AIDEV-NOTE: Applied filters only show after clicking "View X results" to avoid layout shift
  const activeFilters = buildAppliedFilterChips(state.activeFilterValues, {
    distinctReleaseYears,
    distinctReviewYears,
  });

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      createSortAction={createSortAction}
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
      sortOptions={SORT_OPTIONS}
      state={state}
      totalCount={totalCount}
    >
      <div className="tablet:-mx-6 tablet:pt-10">
        <PosterList
          onShowMore={
            paginatedValues.length < totalCount
              ? (): void => dispatch(createShowMoreAction())
              : undefined
          }
        >
          {[...paginatedValues].map((value) => {
            return <ReviewsListItem key={value.imdbId} value={value} />;
          })}
        </PosterList>
      </div>
    </FilterAndSortContainer>
  );
}
