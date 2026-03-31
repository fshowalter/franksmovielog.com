import { useReducer } from "react";

import type { PosterImageProps } from "~/assets/posters";
import type { GradeText, GradeValue } from "~/utils/grades";

import { FilterAndSortContainer } from "~/components/filter-and-sort/container/FilterAndSortContainer";
import { PaginatedList } from "~/components/filter-and-sort/paginated-list/PaginatedList";
import { PosterList } from "~/components/poster-list/PosterList";
import { usePaginatedValues } from "~/hooks/usePaginatedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { ReviewsSort } from "./sortReviews";

import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { filterReviews } from "./filterReviews";
import { ReviewsFilters } from "./ReviewsFilters";
import { ReviewsListItem } from "./ReviewsListItem";
import { createInitialState, reducer } from "./reviewsReducer";
import { sortOptions, sortReviews } from "./sortReviews";

export type ReviewsProps = {
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: ReviewsSort;
  values: ReviewsValue[];
};

export type ReviewsValue = {
  genres: string[];
  grade: GradeText;
  gradeValue: GradeValue;
  imdbId: string;
  posterImageProps: PosterImageProps;
  releaseSequence: number;
  releaseYear: string;
  reviewDisplayDate: string;
  reviewSequence: string;
  reviewYear: string;
  slug: string;
  sortTitle: string;
  title: string;
};

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
