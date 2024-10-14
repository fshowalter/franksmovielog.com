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

import type { Sort } from "./BestOfTheBest.reducer";

import { Actions, initState, reducer } from "./BestOfTheBest.reducer";
import { Filters } from "./Filters";

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
};

export type ListItemValue = {} & ReviewListItemValue;

export function BestOfTheBest({
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
          title="Best of the Best"
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
            { href: "/reviews/", text: "All" },
            { href: "/reviews/underseen/", text: "Underseen" },
            { href: "/reviews/overrated/", text: "Overrated" },
            {
              active: true,
              href: "/reviews/best-of-the-best/",
              text: "Best of the Best",
            },
          ]}
        />
      }
      totalCount={state.filteredValues.length}
    />
  );
}
