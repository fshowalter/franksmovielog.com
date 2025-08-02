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

import { Filters, SortOptions } from "./Filters";
import { Actions, initState, reducer } from "./Viewings.reducer";

export type ListItemValue = Pick<
  Viewing,
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
  viewingMonthShort: string;
};

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
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
          distinctMedia={distinctMedia}
          distinctReleaseYears={distinctReleaseYears}
          distinctVenues={distinctVenues}
          distinctViewingYears={distinctViewingYears}
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

function DateListItem({
  dayAndDate,
  values,
}: {
  dayAndDate: string;
  values: ListItemValue[];
}): JSX.Element {
  const [day, date, month, year] = dayAndDate.split("-");

  return (
    <li
      className={`
        relative flex max-w-(--breakpoint-desktop) flex-col bg-group
        last-of-type:pb-12
        tablet:mb-12 tablet:flex-row tablet:py-4 tablet:pr-4
        tablet:last-of-type:pb-4
      `}
    >
      <div
        className={`
          px-container py-4
          tablet:px-4 tablet:py-0 tablet:text-muted
        `}
      >
        <div
          className={`
            flex items-center gap-1
            tablet:h-full tablet:flex-col tablet:justify-center
          `}
        >
          <div
            className={`
              mr-1 py-2 text-center font-sans text-xxs/none font-light
              text-subtle uppercase
              tablet:mr-0 tablet:w-12 tablet:py-0 tablet:pb-1
            `}
          >
            {month}
          </div>
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
              ml-0 px-1 py-2 text-center font-sans text-xs/none font-light
              text-subtle uppercase
              tablet:w-12 tablet:px-0 tablet:py-1
            `}
          >
            {year}
          </div>
          <div
            className={`
              ml-auto py-2 font-sans text-xxs/none font-light text-subtle
              uppercase
              tablet:ml-0 tablet:w-12 tablet:pt-4 tablet:pb-0 tablet:text-center
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
        gap-x-4 transition-transform
        tablet-landscape:has-[a:hover]:z-hover
        tablet-landscape:has-[a:hover]:scale-105
        tablet-landscape:has-[a:hover]:shadow-all
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
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
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
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
