import { StrictMode, useReducer } from "react";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { GroupedPosterList } from "~/components/poster-list/GroupedPosterList";
import { usePaginatedGroupedValues } from "~/hooks/usePaginatedGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./sortReviewsValues";

import { filterReviewsValues } from "./filteredReviewsValues";
import { Filters, SortOptions } from "./Filters";
import { groupReviewsValues } from "./groupReviewsValues";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createResetFiltersAction,
  createShowMoreAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./reducer";
import { ReviewsListItem } from "./ReviewsListItem";
import { sortReviewsValues } from "./sortReviewsValues";

export type OverratedProps = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  initialSort: ReviewsSort;
  values: ReviewsValue[];
};

export function Overrated({
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  values,
}: OverratedProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );

  const [groupedValues, totalCount] = usePaginatedGroupedValues(
    sortReviewsValues,
    filterReviewsValues,
    groupReviewsValues,
    state.values,
    state.sort,
    state.activeFilterValues,
    state.showCount,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterReviewsValues,
    state.values,
    state.pendingFilterValues,
  );

  const hasPendingFilters = selectHasPendingFilters(state);

  return (
    <FilterAndSortContainer
      filters={
        <Filters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          filterValues={state.pendingFilterValues}
        />
      }
      hasPendingFilters={hasPendingFilters}
      onApplyFilters={() => dispatch(createApplyFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearFiltersAction());
      }}
      onFilterDrawerOpen={() => dispatch(createResetFiltersAction())}
      onResetFilters={() => {
        dispatch(createResetFiltersAction());
      }}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (e) =>
          dispatch(createSortAction(e.target.value as ReviewsSort)),

        sortOptions: <SortOptions />,
      }}
      totalCount={totalCount}
    >
      <GroupedPosterList
        groupedValues={groupedValues}
        onShowMore={() => dispatch(createShowMoreAction())}
        totalCount={totalCount}
        visibleCount={state.showCount}
      >
        {(value) => <ReviewsListItem key={value.imdbId} value={value} />}
      </GroupedPosterList>
    </FilterAndSortContainer>
  );
}

export function OverratedStrictWrapper({
  props,
}: {
  props: OverratedProps;
}): React.JSX.Element {
  return (
    <StrictMode>
      <Overrated {...props} />
    </StrictMode>
  );
}
