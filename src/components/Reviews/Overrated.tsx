import type { JSX } from "react";

import { useReducer } from "react";

import { ListWithFilters } from "~/components/ListWithFilters";

import type { Sort } from "./reducer";
import type { ReviewsListItemValue } from "./ReviewsListItem";

import { Filters, SortOptions } from "./Filters";
import { Actions, initState, reducer } from "./reducer";
import { ReviewsGroupedList } from "./ReviewsGroupedList";
import { ReviewsListItem } from "./ReviewsListItem";

export type Props = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  initialSort: Sort;
  values: ReviewsListItemValue[];
};

export function Overrated({
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
    <ListWithFilters
      filters={
        <Filters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
        />
      }
      list={
        <ReviewsGroupedList
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => <ReviewsListItem key={value.imdbId} value={value} />}
        </ReviewsGroupedList>
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
