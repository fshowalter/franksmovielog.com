import { useReducer } from "react";
import type { BackdropImageProps } from "src/api/backdrops";
import type { PosterImageProps } from "src/api/posters";
import type { WatchlistTitle } from "src/api/watchlistTitles";

import { Backdrop } from "../Backdrop";
import { GroupedList } from "../GroupedList";
import { ListItemPoster } from "../ListItemPoster";
import { ListItemTitle } from "../ListItemTitle";
import {
  ListHeaderButton,
  ListWithFiltersLayout,
} from "../ListWithFiltersLayout";
import { SvgIcon } from "../SvgIcon";
import { WatchlistTitleSlug } from "../WatchlistTitleSlug";
import { Filters } from "./Filters";
import { Actions, initState, reducer, type Sort } from "./Watchlist.reducer";

export type ListItemValue = Pick<
  WatchlistTitle,
  | "imdbId"
  | "title"
  | "year"
  | "releaseSequence"
  | "sortTitle"
  | "directorNames"
  | "performerNames"
  | "writerNames"
  | "collectionNames"
  | "viewed"
>;

export type Props = {
  values: ListItemValue[];
  initialSort: Sort;
  distinctDirectors: string[];
  distinctPerformers: string[];
  distinctWriters: string[];
  distinctCollections: string[];
  distinctReleaseYears: string[];
  defaultPosterImageProps: PosterImageProps;
  backdropImageProps: BackdropImageProps;
  deck: string;
};

export function Watchlist({
  values,
  initialSort,
  distinctDirectors,
  distinctPerformers,
  distinctWriters,
  distinctCollections,
  distinctReleaseYears,
  defaultPosterImageProps,
  backdropImageProps,
  deck,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      values,
      initialSort,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      backdrop={
        <Backdrop
          title="Watchlist"
          deck={deck}
          imageProps={backdropImageProps}
        />
      }
      totalCount={state.filteredValues.length}
      listHeaderButtons={
        <ListHeaderButton href="/watchlist/progress/" text="progress" />
      }
      filters={
        <Filters
          sortValue={state.sortValue}
          dispatch={dispatch}
          distinctDirectors={distinctDirectors}
          distinctPerformers={distinctPerformers}
          distinctWriters={distinctWriters}
          distinctCollections={distinctCollections}
          distinctReleaseYears={distinctReleaseYears}
        />
      }
      list={
        <GroupedList
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          data-testid="list"
        >
          {(value) => {
            return (
              <WatchlistListItem
                value={value}
                key={value.imdbId}
                defaultPosterImageProps={defaultPosterImageProps}
              />
            );
          }}
        </GroupedList>
      }
    />
  );
}

function WatchlistListItem({
  value,
  defaultPosterImageProps,
}: {
  value: ListItemValue;
  defaultPosterImageProps: PosterImageProps;
}): JSX.Element {
  return (
    <li className="relative mb-1 flex max-w-screen-max flex-row items-center gap-x-4 bg-unreviewed px-container py-4 tablet:gap-x-6 tablet:px-4 desktop:px-6">
      <ListItemPoster imageProps={defaultPosterImageProps} />
      <div className="flex flex-1 flex-col tablet:w-full">
        <ListItemTitle title={value.title} year={value.year} />
        <WatchlistTitleSlug
          directorNames={value.directorNames}
          performerNames={value.performerNames}
          writerNames={value.writerNames}
          collectionNames={value.collectionNames}
        />
      </div>
      {value.viewed && (
        <SvgIcon className="block size-6 text-muted tablet:mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </SvgIcon>
      )}
    </li>
  );
}
