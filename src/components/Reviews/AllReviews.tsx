import type { JSX } from "react";

import { useReducer } from "react";

import type { ReviewListItemValue } from "~/components/ReviewListItem";

import { GroupedList } from "~/components/GroupedList";
import { ListWithFilters } from "~/components/ListWithFilters";
import { ReviewListItem } from "~/components/ReviewListItem";

import { Filters, SortOptions } from "./Filters";
import { Actions, initState, reducer, type Sort } from "./reducer";

export type Props = {
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: Sort;
  values: ReviewListItemValue[];
};

export function AllReviews({
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
