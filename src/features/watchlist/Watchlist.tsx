import { useReducer } from "react";

import type { PosterImageProps } from "~/assets/posters";

import { FilterAndSortContainer } from "~/components/filter-and-sort/container/FilterAndSortContainer";
import { PaginatedList } from "~/components/filter-and-sort/paginated-list/PaginatedList";
import { PosterList } from "~/components/poster-list/PosterList";
import { usePaginatedValues } from "~/hooks/usePaginatedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { WatchlistSort } from "./sortWatchlist";

import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { filterWatchlist } from "./filterWatchlist";
import { sortOptions, sortWatchlist } from "./sortWatchlist";
import { WatchlistFilters } from "./WatchlistFilters";
import { WatchlistListItem } from "./WatchlistListItem";
import { createInitialState, reducer } from "./watchlistReducer";

/**
 * Props for the Watchlist component.
 */
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

/**
 * Value object for a watchlist item.
 */
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

/**
 * Component for displaying the watchlist with filtering and sorting.
 * @param props - Component props
 * @param props.defaultPosterImageProps - Default poster image configuration
 * @param props.distinctCollections - Available collections for filtering
 * @param props.distinctDirectors - Available directors for filtering
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctPerformers - Available performers for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctWriters - Available writers for filtering
 * @param props.initialSort - Initial sort configuration
 * @param props.values - Watchlist values to display
 * @returns Watchlist component with filtering and sorting capabilities
 */
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
    reducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );

  const [paginatedValues, totalCount] = usePaginatedValues(
    sortWatchlist,
    filterWatchlist,
    state.values,
    state.sort,
    state.activeFilterValues,
    state.showCount,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterWatchlist,
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
        <WatchlistFilters
          dispatch={dispatch}
          distinctCollections={distinctCollections}
          distinctDirectors={distinctDirectors}
          distinctGenres={distinctGenres}
          distinctPerformers={distinctPerformers}
          distinctReleaseYears={distinctReleaseYears}
          distinctWriters={distinctWriters}
          filterValues={state.pendingFilterValues}
          values={values}
        />
      }
      headerLink={{ href: "/watchlist/progress/", text: "progress" }}
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
            return (
              <WatchlistListItem
                defaultPosterImageProps={defaultPosterImageProps}
                key={value.imdbId}
                value={value}
              />
            );
          })}
        </PosterList>
      </PaginatedList>
    </FilterAndSortContainer>
  );
}
