import { useReducer } from "react";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { PosterList } from "~/components/poster-list/PosterList";
import { usePaginatedValues } from "~/hooks/usePaginatedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./sortReviews";

import { buildAppliedFilterChips } from "./appliedFilterChips";
import { filterReviews } from "./filteredReviews";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createShowMoreAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./reducer";
import { ReviewsFilters, SORT_OPTIONS } from "./ReviewsFilters";
import { ReviewsListItem } from "./ReviewsListItem";
import { sortReviews } from "./sortReviews";

/**
 * Props for the AllReviews component.
 */
export type AllReviewsProps = {
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: ReviewsSort;
  values: ReviewsValue[];
};

/**
 * Component for displaying all reviews with filtering and sorting.
 * @param props - Component props
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.initialSort - Initial sort configuration
 * @param props.values - Review values to display
 * @returns Reviews list component with filtering and sorting capabilities
 */
export function AllReviews({
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  values,
}: AllReviewsProps): React.JSX.Element {
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

  const hasPendingFilters = selectHasPendingFilters(state);
  // AIDEV-NOTE: Applied filters only show after clicking "View X results" to avoid layout shift
  const activeFilters = buildAppliedFilterChips(state.activeFilterValues, {
    distinctReleaseYears,
    distinctReviewYears,
  });

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
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
      hasPendingFilters={hasPendingFilters}
      onApplyFilters={() => dispatch(createApplyFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearFiltersAction());
      }}
      onFilterDrawerOpen={() => dispatch(createResetFiltersAction())}
      onRemoveFilter={(id) => dispatch(createRemoveAppliedFilterAction(id))}
      onResetFilters={() => {
        dispatch(createResetFiltersAction());
      }}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (value) => dispatch(createSortAction(value)),
        sortOptions: SORT_OPTIONS,
      }}
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
