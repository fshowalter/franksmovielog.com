import type { JSX } from "react";

import { useReducer } from "react";

import type { PosterImageProps } from "~/api/posters";
import type { WatchlistTitle } from "~/api/watchlistTitles";

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

  return (
    <ListWithFilters
      filters={
        <Filters
          dispatch={dispatch}
          distinctCollections={distinctCollections}
          distinctDirectors={distinctDirectors}
          distinctPerformers={distinctPerformers}
          distinctReleaseYears={distinctReleaseYears}
          distinctWriters={distinctWriters}
        />
      }
      list={
        <div className="@container/list">
          <GroupedPosterList
            data-testid="list"
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
      </div>
    </PosterListItem>
  );
}
