import { StrictMode, useReducer } from "react";

import type { PosterImageProps } from "~/api/posters";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { FilterAndSortHeaderLink } from "~/components/filter-and-sort/FilterAndSortHeaderLink";
import { TitleSortOptions } from "~/components/ListWithFilters/TitleSortOptions";
import { GroupedPosterList } from "~/components/PosterList";
import { useGroupedValues } from "~/hooks/useGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import { Filters } from "./Filters";
import { filterWatchlistValues } from "./filterWatchlistValues";
import { groupWatchlistValues } from "./groupWatchlistValues";
import { sortWatchlistValues, type WatchlistSort } from "./sortWatchlistValues";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createResetFiltersAction,
  createShowMoreAction,
  createSortAction,
  selectHasPendingFilters,
  watchlistReducer,
} from "./Watchlist.reducer";
import { WatchlistListItem } from "./WatchlistListItem";

export type WatchlistProps = {
  defaultPosterImageProps: PosterImageProps;
  distinctCollections: string[];
  distinctDirectors: string[];
  distinctGenres: string[];
  distinctPerformers: string[];
  distinctReleaseYears: string[];
  distinctWriters: string[];
  initialSort: WatchlistSort;
  values: WatchlistValue[];
};

export type WatchlistValue = {
  genres: string[];
  imdbId: string;
  releaseSequence: number;
  releaseYear: string;
  sortTitle: string;
  title: string;
  watchlistCollectionNames: string[];
  watchlistDirectorNames: string[];
  watchlistPerformerNames: string[];
  watchlistWriterNames: string[];
};

export function Watchlist({
  defaultPosterImageProps,
  distinctCollections,
  distinctDirectors,
  distinctGenres,
  distinctPerformers,
  distinctReleaseYears,
  distinctWriters,
  initialSort,
  values,
}: WatchlistProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    watchlistReducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );

  const [groupedValues, totalCount] = useGroupedValues(
    sortWatchlistValues,
    filterWatchlistValues,
    groupWatchlistValues,
    state.values,
    state.sort,
    state.activeFilterValues,
    state.showCount,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterWatchlistValues,
    state.values,
    state.pendingFilterValues,
  );

  const hasPendingFilters = selectHasPendingFilters(state);

  return (
    <FilterAndSortContainer
      filters={
        <Filters
          dispatch={dispatch}
          distinctCollections={distinctCollections}
          distinctDirectors={distinctDirectors}
          distinctGenres={distinctGenres}
          distinctPerformers={distinctPerformers}
          distinctReleaseYears={distinctReleaseYears}
          distinctWriters={distinctWriters}
          filterValues={state.pendingFilterValues}
        />
      }
      hasPendingFilters={hasPendingFilters}
      headerLinks={
        <FilterAndSortHeaderLink href="/watchlist/progress/" text="progress" />
      }
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
          dispatch(createSortAction(e.target.value as WatchlistSort)),
        sortOptions: <TitleSortOptions options={["title", "release-date"]} />,
      }}
      totalCount={totalCount}
    >
      <div className="@container/list">
        <GroupedPosterList
          groupedValues={groupedValues}
          onShowMore={() => dispatch(createShowMoreAction())}
          totalCount={totalCount}
          visibleCount={state.showCount}
        >
          {(value) => {
            return (
              <WatchlistListItem
                defaultPosterImageProps={defaultPosterImageProps}
                key={value.imdbId}
                value={value}
              />
            );
          }}
        </GroupedPosterList>
      </div>
    </FilterAndSortContainer>
  );
}

export function WatchlistStrictWrapper({
  props,
}: {
  props: WatchlistProps;
}): React.JSX.Element {
  return (
    <StrictMode>
      <Watchlist {...props} />
    </StrictMode>
  );
}
