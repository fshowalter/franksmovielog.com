import { useReducer } from "react";
import type { OverratedDisappointment } from "src/api/overratedDisappointments";
import type { PosterImageProps } from "src/api/posters";
import {
  ListWithFiltersLayout,
  SubNav,
} from "src/components/ListWithFiltersLayout";

import { SolidBackdrop } from "../Backdrop";
import { Grade } from "../Grade";
import { GroupedList } from "../GroupedList";
import { ListItem } from "../ListItem";
import { ListItemGenres } from "../ListItemGenres";
import { ListItemPoster } from "../ListItemPoster";
import { ListItemTitle } from "../ListItemTitle";
import { Filters } from "./Filters";
import type { Sort } from "./Overrated.reducer";
import { Actions, initState, reducer } from "./Overrated.reducer";

export type Props = {
  values: ListItemValue[];
  distinctGenres: string[];
  distinctReleaseYears: string[];
  initialSort: Sort;
};

export type ListItemValue = Pick<
  OverratedDisappointment,
  | "releaseSequence"
  | "title"
  | "year"
  | "sortTitle"
  | "slug"
  | "genres"
  | "grade"
  | "gradeValue"
  | "imdbId"
> & {
  posterImageProps: PosterImageProps;
};

export function Overrated({
  values,
  distinctGenres,
  distinctReleaseYears,
  initialSort,
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
      mastGradient={false}
      backdrop={
        <SolidBackdrop
          title="Overrated Disappointments"
          deck=" One and two star movies with an above-average IMDb rating and vote
        count."
          breadcrumb={
            <>
              <a
                className="hover:bg-default hover:text-default"
                href="/reviews/"
              >
                Reviews
              </a>
            </>
          }
        />
      }
      subNav={
        <SubNav
          values={[
            { href: "/reviews/", text: "all" },
            { href: "/reviews/underseen/", text: "underseen" },
            { href: "/reviews/overrated/", text: "overrated", active: true },
          ]}
        />
      }
      totalCount={state.filteredValues.length}
      filters={
        <Filters
          dispatch={dispatch}
          sortValue={state.sortValue}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          className="bg-default"
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
        >
          {(value) => (
            <UnderseenGemsListItem value={value} key={value.imdbId} />
          )}
        </GroupedList>
      }
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
          title={value.title}
          year={value.year}
          slug={value.slug}
        />
        <div className="mb-1 py-px">
          <Grade value={value.grade} height={18} className="-mt-1" />
        </div>
        <ListItemGenres values={value.genres} />
      </div>
    </ListItem>
  );
}
