import { useReducer } from "react";

import type { PosterImageProps } from "~/api/posters";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { TitleSortOptions } from "~/components/filter-and-sort/TitleSortOptions";
import { GroupedPosterList } from "~/components/poster-list/GroupedPosterList";
import { usePaginatedGroupedValues } from "~/hooks/usePaginatedGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { WatchlistSort } from "./sortWatchlistValues";

import { buildAppliedFilterChips } from "./appliedFilterChips";
import { filterWatchlistValues } from "./filterWatchlistValues";
import { groupWatchlistValues } from "./groupWatchlistValues";
import { sortWatchlistValues } from "./sortWatchlistValues";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createShowMoreAction,
  createSortAction,
  createWatchlistFilterChangedAction,
  reducer,
  selectHasPendingFilters,
} from "./Watchlist.reducer";
import { WatchlistFilters } from "./WatchlistFilters";
import { WatchlistListItem } from "./WatchlistListItem";

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

  const [groupedValues, totalCount] = usePaginatedGroupedValues(
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

  const activeFilters = buildAppliedFilterChips(state.pendingFilterValues);

  /**
   * Handles removal of individual filter chips.
   * For director/performer/writer/collection, removes specific value from array.
   * For other filters, removes entire filter key.
   */
  function handleRemoveAppliedFilter(filterId: string) {
    // Parse the filter ID to determine type and value
    if (filterId.startsWith("director-")) {
      const directorName = filterId
        .replace("director-", "")
        .replaceAll("-", " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const newDirectors = state.pendingFilterValues.director.filter(
        (d) => d !== directorName,
      );
      dispatch(createWatchlistFilterChangedAction("director", newDirectors));
    } else if (filterId.startsWith("performer-")) {
      const performerName = filterId
        .replace("performer-", "")
        .replaceAll("-", " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const newPerformers = state.pendingFilterValues.performer.filter(
        (p) => p !== performerName,
      );
      dispatch(createWatchlistFilterChangedAction("performer", newPerformers));
    } else if (filterId.startsWith("writer-")) {
      const writerName = filterId
        .replace("writer-", "")
        .replaceAll("-", " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const newWriters = state.pendingFilterValues.writer.filter(
        (w) => w !== writerName,
      );
      dispatch(createWatchlistFilterChangedAction("writer", newWriters));
    } else if (filterId.startsWith("collection-")) {
      const collectionName = filterId
        .replace("collection-", "")
        .replaceAll("-", " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const newCollections = state.pendingFilterValues.collection.filter(
        (c) => c !== collectionName,
      );
      dispatch(createWatchlistFilterChangedAction("collection", newCollections));
    } else {
      // For other filters (genres, releaseYear, title), use the standard removal
      dispatch(createRemoveAppliedFilterAction(filterId));
    }
  }

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
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
      hasPendingFilters={hasPendingFilters}
      headerLink={{ href: "/watchlist/progress/", text: "progress" }}
      onApplyFilters={() => dispatch(createApplyFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearFiltersAction());
      }}
      onFilterDrawerOpen={() => dispatch(createResetFiltersAction())}
      onRemoveFilter={handleRemoveAppliedFilter}
      onResetFilters={() => {
        dispatch(createResetFiltersAction());
      }}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (e) =>
          dispatch(createSortAction(e.target.value as WatchlistSort)),
        sortOptions: <TitleSortOptions />,
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
