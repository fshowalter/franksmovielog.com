import { type JSX, useReducer } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { ReviewListItemValue } from "~/components/ReviewListItem";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { GroupedList } from "~/components/GroupedList";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";
import { ReviewListItem } from "~/components/ReviewListItem";
import { ReviewsSubNav } from "~/components/ReviewsSubNav";

import type { Sort } from "./Underrated.reducer";

import { Filters } from "./Filters";
import { Actions, initState, reducer } from "./Underrated.reducer";

export type ListItemValue = ReviewListItemValue & {
  reviewSequence: string;
  reviewYear: string;
};

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  initialSort: Sort;
  values: ListItemValue[];
};

export function Underrated({
  backdropImageProps,
  deck,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
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
          title="Underrated Surprises"
        />
      }
      filters={
        <Filters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
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
      subNav={<ReviewsSubNav active="underrated" />}
      totalCount={state.filteredValues.length}
    />
  );
}
