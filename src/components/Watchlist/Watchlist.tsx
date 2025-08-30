import { useReducer, useState } from "react";

import type { PosterImageProps } from "~/api/posters";
import type { WatchlistTitle } from "~/api/watchlistTitles";

import { ListItemDetails } from "~/components/ListItemDetails";
import { ListItemGenres } from "~/components/ListItemGenres";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListItemWatchlistReason } from "~/components/ListItemWatchlistReason";
import {
  ListHeaderButton,
  ListWithFilters,
} from "~/components/ListWithFilters/ListWithFilters";
import { GroupedPosterList, PosterListItem } from "~/components/PosterList";
import { TitleSortOptions } from "~/components/TitleSortOptions";

import type { Sort } from "./Watchlist.reducer";

import { Filters } from "./Filters";
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
}: Props): React.JSX.Element {
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
        sortOptions: <TitleSortOptions options={["title", "release-date"]} />,
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
}): React.JSX.Element {
  return (
    <PosterListItem
      hasReview={false}
      posterImageProps={defaultPosterImageProps}
    >
      <ListItemDetails>
        <ListItemTitle
          className={`[--list-item-title-unreviewed-color:var(--fg-muted)]`}
          title={value.title}
          year={value.releaseYear}
        />
        <ListItemWatchlistReason
          collectionNames={value.watchlistCollectionNames}
          directorNames={value.watchlistDirectorNames}
          performerNames={value.watchlistPerformerNames}
          writerNames={value.watchlistWriterNames}
        />
        <ListItemGenres values={value.genres} />
      </ListItemDetails>
    </PosterListItem>
  );
}
