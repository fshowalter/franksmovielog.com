import { useReducer } from "react";

import type { PosterImageProps } from "~/assets/posters";
import type { GradeText, GradeValue } from "~/utils/grades";

import { FilterAndSortContainer } from "~/components/filter-and-sort/container/FilterAndSortContainer";
import { PaginatedList } from "~/components/filter-and-sort/paginated-list/PaginatedList";
import { PosterList } from "~/components/poster-list/PosterList";
import { usePaginatedValues } from "~/hooks/usePaginatedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { CollectionTitlesSort } from "./sortCollectionTitles";

import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { createInitialState, reducer } from "./CollectionTitles.reducer";
import { CollectionTitlesFilters } from "./CollectionTitlesFilters";
import { CollectionTitlesListItem } from "./CollectionTitlesListItem";
import { filterCollectionTitles } from "./filterCollectionTitles";
import { sortCollectionTitles, sortOptions } from "./sortCollectionTitles";

/**
 * Props for the CollectionTitles component.
 */
export type CollectionTitlesProps = {
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: CollectionTitlesSort;
  values: CollectionTitlesValue[];
};

/**
 * Value object for a title in a collection.
 */
export type CollectionTitlesValue = {
  genres: string[];
  grade: GradeText | undefined;
  gradeValue: GradeValue | undefined;
  imdbId: string;
  posterImageProps: PosterImageProps;
  releaseSequence: number;
  releaseYear: string;
  reviewDisplayDate: string | undefined;
  reviewSequence: string | undefined;
  reviewSlug: string | undefined;
  reviewYear: string | undefined;
  sortTitle: string;
  title: string;
};

/**
 * CollectionTitles component for displaying titles in a collection.
 * @param props - Component props
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.initialSort - Initial sort configuration
 * @param props.values - Title values to display
 * @returns CollectionTitles component with filtering and sorting capabilities
 */
export function CollectionTitles({
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  values,
}: CollectionTitlesProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values: [...values],
    },
    createInitialState,
  );

  const [paginatedValues, totalCount] = usePaginatedValues(
    sortCollectionTitles,
    filterCollectionTitles,
    state.values,
    state.sort,
    state.activeFilterValues,
    state.showCount,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterCollectionTitles,
    state.values,
    state.pendingFilterValues,
  );

  // AIDEV-NOTE: Applied filters only show after clicking "View X results" to avoid layout shift
  const activeFilters = buildAppliedFilterChips(state.activeFilterValues);

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      dispatch={dispatch}
      filters={
        <CollectionTitlesFilters
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
        visibleCount={state.showCount}
      >
        <PosterList>
          {[...paginatedValues].map((value) => {
            return (
              <CollectionTitlesListItem key={value.imdbId} value={value} />
            );
          })}
        </PosterList>
      </PaginatedList>
    </FilterAndSortContainer>
  );
}
