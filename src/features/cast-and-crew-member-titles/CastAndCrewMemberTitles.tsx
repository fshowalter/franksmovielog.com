import { StrictMode, useReducer } from "react";

import type { PosterImageProps } from "~/api/posters";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { TitleSortOptions } from "~/components/ListWithFilters/TitleSortOptions";
import { GroupedPosterList } from "~/components/poster-list/GroupedPosterList";
import { useGroupedValues } from "~/hooks/useGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createResetFiltersAction,
  createShowMoreAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./CastAndCrewMemberTitles.reducer";
import { CastAndCrewMemberTitleListItem } from "./CastAndCrewMemberTitlesListItem";
import { filterCastAndCrewMemberTitlesValues } from "./filterCastAndCrewMemberTitlesValues";
import { Filters } from "./Filters";
import { groupCastAndCrewMemberTitlesValues } from "./groupCastAndCrewMemberTitlesValues";
import {
  type CastAndCrewMemberTitlesSort,
  sortCastAndCrewMemberTitlesValues,
} from "./sortCastAndCrewMemberTitlesValues";

export type CastAndCrewMemberTitlesProps = {
  distinctCreditKinds: readonly string[];
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: CastAndCrewMemberTitlesSort;
  values: CastAndCrewMemberTitlesValue[];
};

export type CastAndCrewMemberTitlesValue = {
  creditedAs: string[];
  genres: string[];
  grade?: string;
  gradeValue?: number;
  imdbId: string;
  posterImageProps: PosterImageProps;
  releaseSequence: number;
  releaseYear: string;
  reviewDisplayDate?: string;
  reviewSequence?: number;
  reviewYear?: string;
  slug?: string;
  sortTitle: string;
  title: string;
  watchlistCollectionNames: string[];
  watchlistDirectorNames: string[];
  watchlistPerformerNames: string[];
  watchlistWriterNames: string[];
};

export function CastAndCrewMemberTitles({
  distinctCreditKinds,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  values,
}: CastAndCrewMemberTitlesProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values: [...values],
    },
    createInitialState,
  );

  const [groupedValues, totalCount] = useGroupedValues(
    sortCastAndCrewMemberTitlesValues,
    filterCastAndCrewMemberTitlesValues,
    groupCastAndCrewMemberTitlesValues,
    state.values,
    state.sort,
    state.activeFilterValues,
    state.showCount,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterCastAndCrewMemberTitlesValues,
    state.values,
    state.pendingFilterValues,
  );

  const hasPendingFilters = selectHasPendingFilters(state);

  return (
    <FilterAndSortContainer
      filters={
        <Filters
          dispatch={dispatch}
          distinctCreditKinds={distinctCreditKinds}
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
          dispatch(
            createSortAction(e.target.value as CastAndCrewMemberTitlesSort),
          ),
        sortOptions: (
          <TitleSortOptions
            options={["grade", "release-date", "review-date", "title"]}
          />
        ),
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
          return (
            <CastAndCrewMemberTitleListItem key={value.imdbId} value={value} />
          );
        }}
      </GroupedPosterList>
    </FilterAndSortContainer>
  );
}

export function CastAndCrewMemberTitlesStrictWrapper({
  props,
}: {
  props: CastAndCrewMemberTitlesProps;
}): React.JSX.Element {
  return (
    <StrictMode>
      <CastAndCrewMemberTitles {...props} />
    </StrictMode>
  );
}
