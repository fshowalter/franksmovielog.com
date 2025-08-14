import type { JSX } from "react";

import { useEffect, useReducer, useState } from "react";

import type { ReviewListItemValue } from "~/components/ReviewListItem";

import { GroupedList } from "~/components/GroupedList";
import { ListWithFilters } from "~/components/ListWithFilters";
import { ReviewGridItem } from "~/components/ReviewGridItem";
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

  const [isGridLayout, setIsGridLayout] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      const tabletLandscapeBreakpoint = Number.parseFloat(
        globalThis
          .getComputedStyle(document.body)
          .getPropertyValue("--breakpoint-tablet-landscape"),
      );
      setIsGridLayout(window.innerWidth >= tabletLandscapeBreakpoint);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

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
          className=""
          data-testid="list"
          groupedValues={state.groupedValues}
          isGrid={isGridLayout}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) =>
            isGridLayout ? (
              <ReviewGridItem key={value.imdbId} value={value} />
            ) : (
              <ReviewListItem key={value.imdbId} value={value} />
            )
          }
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
