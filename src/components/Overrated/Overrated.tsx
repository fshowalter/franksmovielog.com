import { useReducer } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { OverratedDisappointment } from "~/api/overratedDisappointments";
import type { PosterImageProps } from "~/api/posters";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { Grade } from "~/components/Grade";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemGenres } from "~/components/ListItemGenres";
import { ListItemPoster } from "~/components/ListItemPoster";
import { ListItemTitle } from "~/components/ListItemTitle";
import {
  ListWithFiltersLayout,
  SubNav,
} from "~/components/ListWithFiltersLayout";

import type { Sort } from "./Overrated.reducer";

import { Filters } from "./Filters";
import { Actions, initState, reducer } from "./Overrated.reducer";

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctGenres: string[];
  distinctReleaseYears: string[];
  initialSort: Sort;
  values: ListItemValue[];
};

export type ListItemValue = {
  posterImageProps: PosterImageProps;
} & Pick<
  OverratedDisappointment,
  | "genres"
  | "grade"
  | "gradeValue"
  | "imdbId"
  | "releaseSequence"
  | "slug"
  | "sortTitle"
  | "title"
  | "year"
>;

export function Overrated({
  backdropImageProps,
  deck,
  distinctGenres,
  distinctReleaseYears,
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
          breadcrumb={<BreadcrumbLink href="/reviews/">Reviews</BreadcrumbLink>}
          deck={deck}
          imageProps={backdropImageProps}
          title="Overrated Disappointments"
        />
      }
      filters={
        <Filters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          sortValue={state.sortValue}
        />
      }
      list={
        <GroupedList
          className="bg-default"
          data-testid="list"
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => (
            <UnderseenGemsListItem key={value.imdbId} value={value} />
          )}
        </GroupedList>
      }
      mastGradient={false}
      subNav={
        <SubNav
          values={[
            { href: "/reviews/", text: "all" },
            { href: "/reviews/underseen/", text: "underseen" },
            { active: true, href: "/reviews/overrated/", text: "overrated" },
          ]}
        />
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function UnderseenGemsListItem({
  value,
}: {
  value: ListItemValue;
}): JSX.Element {
  return (
    <ListItem>
      <ListItemPoster imageProps={value.posterImageProps} />
      <div className="flex grow flex-col gap-2 tablet:w-full desktop:pr-4">
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
        <div className="mb-1 py-px">
          <Grade className="-mt-1" height={18} value={value.grade} />
        </div>
        <ListItemGenres values={value.genres} />
      </div>
    </ListItem>
  );
}
