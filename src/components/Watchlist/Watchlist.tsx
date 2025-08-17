import type { JSX } from "react";

import { useReducer, useState } from "react";

import type { PosterImageProps } from "~/api/posters";
import type { WatchlistTitle } from "~/api/watchlistTitles";

import { ListItemGenres } from "~/components/ListItemGenres";
import { ListItemTitle } from "~/components/ListItemTitle";
import {
  ListHeaderButton,
  ListWithFilters,
} from "~/components/ListWithFilters";
import { GroupedPosterList, PosterListItem } from "~/components/PosterList";
import { WatchlistTitleSlug } from "~/components/WatchlistTitleSlug";

import type { Sort } from "./Watchlist.reducer";

import { Filters, SortOptions } from "./Filters";
import { Actions, initState, reducer } from "./Watchlist.reducer";

export type ListItemValue = Pick<
  WatchlistTitle,
  | "genres"
  | "imdbId"
  | "releaseSequence"
  | "releaseYear"
  | "sortTitle"
  | "title"
  | "viewed"
  | "watchlistCollectionNames"
  | "watchlistDirectorNames"
  | "watchlistPerformerNames"
  | "watchlistWriterNames"
>;

export type Props = {
  defaultPosterImageProps: PosterImageProps;
  distinctCollections: string[];
  distinctDirectors: string[];
  distinctGenres: string[];
  distinctPerformers: string[];
  distinctReleaseYears: string[];
  distinctWriters: string[];
  initialSort: Sort;
  values: ListItemValue[];
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
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );
  const [filterKey, setFilterKey] = useState(0);

  return (
    <ListWithFilters
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
          key={filterKey}
        />
      }
      hasActiveFilters={state.hasActiveFilters}
      list={
        <div className="@container/list">
          <GroupedPosterList
            groupedValues={state.groupedValues}
            onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
            totalCount={state.filteredValues.length}
            visibleCount={state.showCount!}
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
      }
      listHeaderButtons={
        <ListHeaderButton href="/watchlist/progress/" text="progress" />
      }
      onApplyFilters={() => dispatch({ type: Actions.APPLY_PENDING_FILTERS })}
      onClearFilters={() => {
        dispatch({ type: Actions.CLEAR_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      onFilterDrawerOpen={() =>
        dispatch({ type: Actions.RESET_PENDING_FILTERS })
      }
      onResetFilters={() => {
        dispatch({ type: Actions.RESET_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      pendingFilteredCount={state.pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          }),
        sortOptions: <SortOptions />,
      }}
      totalCount={state.filteredValues.length}
    />
  );
}

function WatchlistListItem({
  defaultPosterImageProps,
  value,
}: {
  defaultPosterImageProps: PosterImageProps;
  value: ListItemValue;
}): JSX.Element {
  return (
    <PosterListItem
      className={`bg-unreviewed`}
      posterImageProps={defaultPosterImageProps}
    >
      <div
        className={`
          mt-1 flex flex-1 flex-col justify-center gap-y-1
          tablet:w-full tablet:justify-normal tablet:px-1
        `}
      >
        <ListItemTitle title={value.title} year={value.releaseYear} />
        <WatchlistTitleSlug
          collectionNames={value.watchlistCollectionNames}
          directorNames={value.watchlistDirectorNames}
          performerNames={value.watchlistPerformerNames}
          writerNames={value.watchlistWriterNames}
        />
        <ListItemGenres values={value.genres} />
      </div>
    </PosterListItem>
  );
}
