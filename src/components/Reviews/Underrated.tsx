import type { JSX } from "react";

import { useReducer } from "react";

import type { ReviewListItemValue } from "~/components/ReviewListItem";

import { GroupedList } from "~/components/GroupedList";
import { ListWithFilters } from "~/components/ListWithFilters";
import { ReviewListItem } from "~/components/ReviewListItem";
import { Filters, SortOptions } from "~/components/Reviews/Filters";
import {
  Actions,
  initState,
  reducer,
  type Sort,
} from "~/components/Reviews/reducer";

export type Props = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  initialSort: Sort;
  values: ReviewListItemValue[];
};

export function Underrated({
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
