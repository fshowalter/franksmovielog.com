import { useReducer } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { ReviewListItemValue } from "~/components/ReviewListItem";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { GroupedList } from "~/components/GroupedList";
import {
  ListWithFiltersLayout,
  SubNav,
} from "~/components/ListWithFiltersLayout";
import { ReviewListItem } from "~/components/ReviewListItem";

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

export type ListItemValue = {} & ReviewListItemValue;

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
          {(value) => <ReviewListItem key={value.imdbId} value={value} />}
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
