import { type JSX, useReducer } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { ReviewListItemValue } from "~/components/ReviewListItem";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { GroupedList } from "~/components/GroupedList";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";
import { ReviewListItem } from "~/components/ReviewListItem";
import { ReviewsSubNav } from "~/components/ReviewsSubNav";

import type { Sort } from "./Underseen.reducer";

import { Filters, SortOptions } from "./Filters";
import { Actions, initState, reducer } from "./Underseen.reducer";

export type ListItemValue = ReviewListItemValue & {
  reviewSequence: string;
  reviewYear: string;
};

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
};

export function Underseen({
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
          title="Underseen Gems"
        />
      }
      filters={
        <Filters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
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
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          }),
        sortOptions: <SortOptions />,
      }}
      subNav={<ReviewsSubNav active="underseen" />}
      totalCount={state.filteredValues.length}
    />
  );
}
