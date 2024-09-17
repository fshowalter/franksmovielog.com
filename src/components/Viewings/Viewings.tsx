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
    <li className="relative mb-px flex max-w-screen-max flex-col gap-2 gap-x-4 bg-default px-container-base py-4 shadow-bottom first:pt-0 last-of-type:shadow-none tablet:flex-row tablet:items-center tablet:gap-x-6 tablet:bg-subtle tablet:px-4 tablet:shadow-none showFilters:pr-0 desktop:px-6 desktop:pr-0">
      <div className="text-muted tablet:mt-[2px]">
        <div className="flex items-center gap-1 tablet:block tablet:shadow-all">
          <div className="py-2 uppercase tablet:w-12 tablet:bg-canvas tablet:text-center tablet:text-sm/none">
            {day}
          </div>
          <div className="text-center text-muted tablet:text-2.5xl/8">
            {date}
          </div>
        </div>
      </div>
      <ul className="flex grow flex-col gap-y-4 tablet:gap-y-0 tablet:pb-6 tablet:shadow-bottom">
        {values.map((value) => {
          return <ViewingListItem value={value} key={value.sequence} />;
        })}
      </ul>
    </li>
  );
}

function ViewingListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <li className="mb-px flex flex-row items-center gap-x-4 bg-default pb-4 shadow-bottom last:pb-0 last:shadow-none tablet:gap-x-6 tablet:py-4 tablet:pl-4 tablet:last:pb-4">
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
