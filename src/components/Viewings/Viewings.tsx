import { useReducer } from "react";
import type { BackdropImageProps } from "src/api/backdrops";
import type { PosterImageProps } from "src/api/posters";
import type { Viewing } from "src/api/viewings";
import { GroupedList } from "src/components/GroupedList";
import { ListItem } from "src/components/ListItem";
import { ListItemMediumAndVenue } from "src/components/ListItemMediumAndVenue";
import { ListItemPoster } from "src/components/ListItemPoster";
import { ListItemTitle } from "src/components/ListItemTitle";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import { Filters } from "./Filters";
import type { Sort } from "./Viewings.reducer";
import { Actions, initState, reducer } from "./Viewings.reducer";

export type Props = {
  values: ListItemValue[];
  distinctGenres: readonly string[];
  distinctMedia: readonly string[];
  distinctVenues: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctViewingYears: readonly string[];
  initialSort: Sort;
  backdropImageProps: BackdropImageProps;
};

export type ListItemValue = Pick<
  Viewing,
  | "sequence"
  | "viewingYear"
  | "viewingDate"
  | "releaseSequence"
  | "title"
  | "medium"
  | "venue"
  | "year"
  | "sortTitle"
  | "slug"
  | "genres"
> & {
  viewingMonth: string;
  viewingDay: string;
  posterImageProps: PosterImageProps;
};

export function Viewings({
  values,
  distinctGenres,
  distinctMedia,
  distinctVenues,
  distinctReleaseYears,
  distinctViewingYears,
  initialSort,
  backdropImageProps,
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
      title="Viewing Log"
      alt="Angels to some, demons to others."
      deck='"We have such sights to show you!"'
      backdropImageProps={backdropImageProps}
      totalCount={state.filteredValues.length}
      onToggleFilters={() => dispatch({ type: Actions.TOGGLE_FILTERS })}
      filtersVisible={state.showFilters}
      seeAlso={[{ href: "/viewings/stats/", text: "stats" }]}
      filters={
        <Filters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctMedia={distinctMedia}
          distinctVenues={distinctVenues}
          distinctReleaseYears={distinctReleaseYears}
          distinctViewingYears={distinctViewingYears}
          sortValue={state.sortValue}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
        >
          {(dateGroup) => {
            const [dayAndDate, values] = dateGroup;
            return (
              <DateListItem
                values={values}
                key={dayAndDate}
                dayAndDate={dayAndDate}
              />
            );
          }}
        </GroupedList>
      }
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
    <li className="relative flex max-w-screen-max flex-col gap-2 gap-x-4 first:pt-0 tablet:flex-row tablet:items-center tablet:gap-x-8 tablet:px-4 showFilters:pr-0 desktop:px-6 desktop:pr-0">
      <div className="px-container-base py-1 text-muted tablet:px-0">
        <div className="flex items-center gap-1 tablet:block tablet:shadow-all">
          <div className="py-2 uppercase tablet:w-12 tablet:bg-canvas tablet:text-center tablet:text-sm/none">
            {day}
          </div>
          <div className="text-center text-muted tablet:text-2.5xl/8">
            {date}
          </div>
        </div>
      </div>
      <ul className="flex grow flex-col tablet:my-4 tablet:gap-y-0 tablet:bg-subtle">
        {values.map((value) => {
          return <ViewingListItem value={value} key={value.sequence} />;
        })}
      </ul>
    </li>
  );
}

function ViewingListItem({ value }: { value: ListItemValue }): JSX.Element {
  let rest = {};
  if (value.slug) {
    rest = { "data-has-review": true };
  }

  return (
    <li
      className="mb-1 flex flex-row items-center gap-x-4 bg-default px-container-base py-4 last:shadow-none last-of-type:mb-0 only-of-type:mb-0 tablet:gap-x-6 tablet:py-4 tablet:pl-6"
      style={{
        background: value.slug ? "var(--bg-default)" : "var(--bg-subtle)",
      }}
      {...rest}
    >
      <ListItemPoster
        slug={value.slug}
        title={value.title}
        year={value.year}
        imageProps={value.posterImageProps}
      />
      <div className="flex grow flex-col gap-1">
        <ListItemTitle
          title={value.title}
          year={value.year}
          slug={value.slug}
        />
        <ListItemMediumAndVenue medium={value.medium} venue={value.venue} />
      </div>
    </li>
  );
}
