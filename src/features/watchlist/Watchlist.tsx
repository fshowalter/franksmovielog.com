import { useMemo, useReducer } from "react";

import type { PosterImageProps } from "~/api/posters";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { FilterAndSortHeaderLink } from "~/components/filter-and-sort/FilterAndSortHeaderLink";
import { TitleSortOptions } from "~/components/ListWithFilters/TitleSortOptions";
import { GroupedPosterList } from "~/components/PosterList";

import type { WatchlistSort } from "./Watchlist.selectors";

import { Filters } from "./Filters";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createResetFiltersAction,
  createShowMoreAction,
  createSortAction,
  watchlistReducer,
} from "./Watchlist.reducer";
import {
  selectFilteredWatchlistValues,
  selectGroupedValues,
  selectHasActiveFilters,
  selectSortedWatchlistValues,
} from "./Watchlist.selectors";
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

  console.log(state);

  const sortedValues = useMemo(
    () => selectSortedWatchlistValues(state.values, state.sort),
    [state.values, state.sort],
  );

  const filteredValues = useMemo(
    () => selectFilteredWatchlistValues(state.activeFilterValues, sortedValues),
    [state.activeFilterValues, sortedValues],
  );

  const groupedValues = useMemo(
    () => selectGroupedValues(filteredValues, state.showCount, state.sort),
    [filteredValues, state.showCount, state.sort],
  );

  const pendingFilteredCount = useMemo(
    () =>
      selectFilteredWatchlistValues(state.pendingFilterValues, sortedValues)
        .length,
    [state.pendingFilterValues, sortedValues],
  );

  const hasActiveFilters = useMemo(
    () => selectHasActiveFilters(state.pendingFilterValues),
    [state.pendingFilterValues],
  );

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
      hasActiveFilters={hasActiveFilters}
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
      totalCount={filteredValues.length}
    >
      <div className="@container/list">
        <GroupedPosterList
          groupedValues={groupedValues}
          onShowMore={() => dispatch(createShowMoreAction())}
          totalCount={filteredValues.length}
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
