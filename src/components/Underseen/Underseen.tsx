import { useReducer } from "react";
import type { PosterImageProps } from "src/api/posters";
import type { UnderseenGem } from "src/api/underseenGems";
import {
  ListWithFiltersLayout,
  SubNav,
} from "src/components/ListWithFiltersLayout";

import { Grade } from "../Grade";
import { GroupedList } from "../GroupedList";
import { ListItem } from "../ListItem";
import { ListItemGenres } from "../ListItemGenres";
import { ListItemPoster } from "../ListItemPoster";
import { ListItemTitle } from "../ListItemTitle";
import { Filters } from "./Filters";
import type { Sort } from "./Underseen.reducer";
import { Actions, initState, reducer } from "./Underseen.reducer";

export type Props = {
  values: ListItemValue[];
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  initialSort: Sort;
};

export type ListItemValue = Pick<
  UnderseenGem,
  | "releaseSequence"
  | "title"
  | "year"
  | "sortTitle"
  | "slug"
  | "grade"
  | "gradeValue"
  | "imdbId"
  | "genres"
> & {
  posterImageProps: PosterImageProps;
};

export function Underseen({
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
      title="Underseen Gems"
      breadcrumb={
        <>
          <a href="/reviews/">Reviews</a>
        </>
      }
      subNav={
        <SubNav
          values={[
            { href: "/reviews/", text: "all" },
            { href: "/reviews/underseen/", text: "underseen", active: true },
            { href: "/reviews/overrated/", text: "overrated" },
          ]}
        />
      }
      deck="Four and five star movies with a below average number of IMDb votes."
      totalCount={state.filteredValues.length}
      onToggleFilters={() => dispatch({ type: Actions.TOGGLE_FILTERS })}
      filtersVisible={state.showFilters}
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
    <ListItem className="items-center">
      <ListItemPoster
        slug={value.slug}
        title={value.title}
        year={value.year}
        imageProps={value.posterImageProps}
      />
      <div className="grow pr-gutter tablet:w-full desktop:pr-4">
        <div>
          <ListItemTitle
            title={value.title}
            year={value.year}
            slug={value.slug}
          />
          <div className="spacer-y-1" />
          <div className="py-px">
            <Grade value={value.grade} height={18} />
          </div>
          <div className="spacer-y-2" />
          <ListItemGenres values={value.genres} />
          <div className="spacer-y-2" />
        </div>
      </div>
    </ListItem>
  );
}
