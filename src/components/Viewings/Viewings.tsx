import { type JSX, useReducer } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { PosterImageProps } from "~/api/posters";
import type { Viewing } from "~/api/viewings";

import { Backdrop } from "~/components/Backdrop";
import { GroupedList } from "~/components/GroupedList";
import { ListItemMediumAndVenue } from "~/components/ListItemMediumAndVenue";
import { ListItemPoster } from "~/components/ListItemPoster";
import {
  ListHeaderButton,
  ListWithFiltersLayout,
} from "~/components/ListWithFiltersLayout";

import type { Sort } from "./Viewings.reducer";

import { Filters } from "./Filters";
import { Actions, initState, reducer } from "./Viewings.reducer";

export type ListItemValue = Pick<
  Viewing,
  | "genres"
  | "medium"
  | "releaseSequence"
  | "sequence"
  | "slug"
  | "sortTitle"
  | "title"
  | "venue"
  | "viewingDate"
  | "viewingYear"
  | "year"
> & {
  posterImageProps: PosterImageProps;
  viewingDay: string;
  viewingMonth: string;
};

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctGenres: readonly string[];
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
};

export function Viewings({
  backdropImageProps,
  deck,
  distinctGenres,
  distinctMedia,
  distinctReleaseYears,
  distinctVenues,
  distinctViewingYears,
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
          title="Viewing Log"
        />
      }
      filters={
        <Filters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctMedia={distinctMedia}
          distinctReleaseYears={distinctReleaseYears}
          distinctVenues={distinctVenues}
          distinctViewingYears={distinctViewingYears}
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
          {(dateGroup) => {
            const [dayAndDate, values] = dateGroup;
            return (
              <DateListItem
                dayAndDate={dayAndDate}
                key={dayAndDate}
                values={values}
              />
            );
          }}
        </GroupedList>
      }
      listHeaderButtons={
        <ListHeaderButton href="/viewings/stats/" text="stats" />
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function DateListItem({
  dayAndDate,
  values,
}: {
  dayAndDate: string;
  values: ListItemValue[];
}): JSX.Element {
  const [day, date] = dayAndDate.split("-");

  return (
    <li
      className={`
        relative flex max-w-(--breakpoint-max) flex-col bg-group
        last-of-type:pb-12
        tablet:mb-12 tablet:flex-row tablet:py-4 tablet:pr-4
        tablet:last-of-type:pb-4
      `}
    >
      <div
        className={`
          px-container py-4
          tablet:px-4 tablet:pt-11 tablet:text-muted
        `}
      >
        <div
          className={`
            flex items-center gap-1
            tablet:block
          `}
        >
          <div
            className={`
              text-center text-2xl text-muted
              tablet:text-2.5xl/8
            `}
          >
            {date}
          </div>
          <div
            className={`
              ml-1 py-2 font-sans text-xxs/none text-subtle uppercase
              tablet:ml-0 tablet:w-12 tablet:text-center
            `}
          >
            {day}
          </div>
        </div>
      </div>
      <ul
        className={`
          flex h-full grow flex-col
          tablet:gap-y-0
        `}
      >
        {values.map((value) => {
          return <ViewingListItem key={value.sequence} value={value} />;
        })}
      </ul>
    </li>
  );
}

function ListItemTitle({
  slug,
  title,
  year,
}: {
  slug?: string;
  title: string;
  year: string;
}) {
  const yearBox = (
    <span
      className={`
        text-xxs font-light text-subtle
        tablet:text-xs
      `}
    >
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        className={`
          block font-sans text-sm font-medium text-accent
          after:absolute after:top-0 after:left-0 after:size-full
          after:opacity-0
        `}
        href={`/reviews/${slug}/`}
      >
        {title}
        {"\u202F"}
        {"\u202F"}
        {yearBox}
      </a>
    );
  }

  return (
    <span className="block font-sans text-sm font-normal text-muted">
      {title}
      {"\u202F"}
      {"\u202F"}
      {yearBox}
    </span>
  );
}

function ViewingListItem({ value }: { value: ListItemValue }): JSX.Element {
  let rest = {};
  if (value.slug) {
    rest = { "data-has-review": true };
  }

  return (
    <li
      className={`
        group/list-item relative mb-1 flex transform-gpu flex-row items-center
        gap-x-4
        has-[a:hover]:z-30 has-[a:hover]:shadow-all
        has-[a:hover]:drop-shadow-2xl
        ${value.slug ? `bg-default` : `bg-unreviewed`}
        px-container py-4
        last-of-type:mb-0
        tablet:gap-x-6 tablet:pl-4
      `}
      {...rest}
    >
      <div
        className={`
          relative
          after:absolute after:top-0 after:left-0 after:z-10 after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
        `}
      >
        <ListItemPoster imageProps={value.posterImageProps} />
      </div>
      <div className="flex grow flex-col gap-1">
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
        <ListItemMediumAndVenue medium={value.medium} venue={value.venue} />
      </div>
    </li>
  );
}
