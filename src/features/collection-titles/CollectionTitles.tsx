import { useReducer } from "react";

import type { PosterImageProps } from "~/api/posters";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { ReviewedTitleSortOptions } from "~/components/filter-and-sort/ReviewedTitleSortOptions";
import { GroupedPosterList } from "~/components/poster-list/GroupedPosterList";
import { usePaginatedGroupedValues } from "~/hooks/usePaginatedGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { CollectionTitlesSort } from "./sortCollectionTitles";

import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createResetFiltersAction,
  createShowMoreAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./CollectionTitles.reducer";
import { CollectionTitlesListItem } from "./CollectionTitlesListItem";
import { filterCollectionTitles } from "./filterCollectionTitles";
import { Filters } from "./Filters";
import { groupCollectionTitles } from "./groupCollectionTitles";
import { sortCollectionTitles } from "./sortCollectionTitles";

export type CollectionTitlesProps = {
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: CollectionTitlesSort;
  values: CollectionTitlesValue[];
};

export type CollectionTitlesValue = {
  genres: string[];
  grade?: string;
  gradeValue?: number;
  imdbId: string;
  posterImageProps: PosterImageProps;
  releaseSequence: number;
  releaseYear: string;
  reviewDisplayDate: string;
  reviewSequence?: number;
  reviewYear?: string;
  slug?: string;
  sortTitle: string;
  title: string;
};

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

  const [groupedValues, totalCount] = usePaginatedGroupedValues(
    sortCollectionTitles,
    filterCollectionTitles,
    groupCollectionTitles,
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
          dispatch(createSortAction(e.target.value as CollectionTitlesSort)),
        sortOptions: <ReviewedTitleSortOptions />,
      }}
      totalCount={totalCount}
    >
      <GroupedPosterList
        groupedValues={groupedValues}
        onShowMore={() => dispatch(createShowMoreAction())}
        totalCount={totalCount}
        visibleCount={state.showCount}
      >
        {(value) => {
          return <CollectionTitlesListItem key={value.imdbId} value={value} />;
        }}
      </GroupedPosterList>
    </FilterAndSortContainer>
  );
}
