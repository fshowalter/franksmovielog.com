import { type JSX, useReducer } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { PosterImageProps } from "~/api/posters";
import type { WatchlistTitle } from "~/api/watchlistTitles";

import { Backdrop } from "~/components/Backdrop";
import { GroupedList } from "~/components/GroupedList";
import { ListItemPoster } from "~/components/ListItemPoster";
import { ListItemTitle } from "~/components/ListItemTitle";
import {
  ListHeaderButton,
  ListWithFiltersLayout,
} from "~/components/ListWithFiltersLayout";
import { SvgIcon } from "~/components/SvgIcon";
import { WatchlistTitleSlug } from "~/components/WatchlistTitleSlug";

import { Filters } from "./Filters";
import { Actions, initState, reducer, type Sort } from "./Watchlist.reducer";

export type ListItemValue = Pick<
  WatchlistTitle,
  | "collectionNames"
  | "directorNames"
  | "imdbId"
  | "performerNames"
  | "releaseSequence"
  | "sortTitle"
  | "title"
  | "viewed"
  | "writerNames"
  | "year"
>;

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
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
  backdropImageProps,
  deck,
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
    <ListWithFiltersLayout
      backdrop={
        <Backdrop
          deck={deck}
          imageProps={backdropImageProps}
          title="Watchlist"
        />
      }
      filters={
        <Filters
          dispatch={dispatch}
          distinctCollections={distinctCollections}
          distinctDirectors={distinctDirectors}
          distinctPerformers={distinctPerformers}
          distinctReleaseYears={distinctReleaseYears}
          distinctWriters={distinctWriters}
          sortValue={state.sortValue}
        />
      }
      list={
        <GroupedList
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
        </GroupedList>
      }
      listHeaderButtons={
        <ListHeaderButton href="/watchlist/progress/" text="progress" />
      }
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
    <li
      className={`
        relative mb-1 flex max-w-(--breakpoint-max) flex-row items-center
        gap-x-4 bg-unreviewed px-container py-4
        tablet:gap-x-6 tablet:px-4
        laptop:px-6
      `}
    >
      <ListItemPoster imageProps={defaultPosterImageProps} />
      <div
        className={`
          flex flex-1 flex-col gap-y-1
          tablet:w-full
        `}
      >
        <ListItemTitle title={value.title} year={value.year} />
        <WatchlistTitleSlug
          collectionNames={value.collectionNames}
          directorNames={value.directorNames}
          performerNames={value.performerNames}
          writerNames={value.writerNames}
        />
      </div>
      {value.viewed && (
        <SvgIcon
          className={`
            block size-6 text-muted
            tablet:mr-4
          `}
        >
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SvgIcon>
      )}
    </li>
  );
}
