import { useEffect, useReducer, useRef } from "react";

import { FilterAndSortContainer } from "~/components/filter-and-sort/container/FilterAndSortContainer";
import { useFilteredValues } from "~/hooks/useFilteredValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { ViewingsSort } from "./sortViewings";

import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { CalendarMonth } from "./CalendarMonth";
import { filterViewings } from "./filterViewings";
import { MonthNavigationHeader } from "./MonthNavigationHeader";
import { sortOptions, sortViewings } from "./sortViewings";
import { useMonthNavigation } from "./useMonthNavigation";
import { ViewingsFilters } from "./ViewingsFilters";
import { createInitialState, reducer } from "./viewingsReducer";

/**
 * Props for the Viewings component.
 */
export type ViewingsProps = {
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  initialSort: ViewingsSort;
  posterHeight: number;
  posterWidth: number;
  values: ViewingsValue[];
};

/**
 * Value object for a viewing item.
 */
export type ViewingsValue = {
  date: string; // Full date string YYYY-MM-DD
  medium?: string;
  posterSrcProps: {
    src: string;
    srcSet: string;
  };
  releaseYear: string;
  reviewSlug?: string;
  sequence: string;
  sortTitle: string;
  title: string;
  venue?: string;
  viewingYear: string;
};

export function Viewings({
  distinctMedia,
  distinctReleaseYears,
  distinctVenues,
  distinctViewingYears,
  initialSort,
  posterHeight,
  posterWidth,
  values,
}: ViewingsProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );
  const prevMonthRef = useRef(state.selectedMonthDate);

  // Scroll to top of calendar when month changes
  useEffect(() => {
    if (prevMonthRef.current === state.selectedMonthDate) {
      return;
    }

    prevMonthRef.current = state.selectedMonthDate;
    if (typeof document !== "undefined") {
      document
        .querySelector("#calendar")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.selectedMonthDate]);

  const filteredValues = useFilteredValues(
    sortViewings,
    filterViewings,
    state.values,
    state.sort,
    state.activeFilterValues,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterViewings,
    state.values,
    state.pendingFilterValues,
  );

  // AIDEV-NOTE: Applied filters only show after clicking "View X results" to avoid layout shift
  const activeFilters = buildAppliedFilterChips(state.activeFilterValues);

  const [previousMonthDate, currentMonthDate, nextMonthDate] =
    useMonthNavigation(filteredValues, state.sort, state.selectedMonthDate);

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      dispatch={dispatch}
      filters={
        <ViewingsFilters
          dispatch={dispatch}
          distinctMedia={distinctMedia}
          distinctReleaseYears={distinctReleaseYears}
          distinctVenues={distinctVenues}
          distinctViewingYears={distinctViewingYears}
          filterValues={state.pendingFilterValues}
          values={values}
        />
      }
      headerLink={{ href: "/viewings/stats/", text: "stats" }}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        sortOptions,
      }}
      state={state}
      totalCount={filteredValues.length}
    >
      {currentMonthDate ? (
        <div className={`mx-auto w-full max-w-(--breakpoint-desktop)`}>
          <MonthNavigationHeader
            currentMonthDate={currentMonthDate}
            dispatch={dispatch}
            nextMonthDate={nextMonthDate}
            prevMonthDate={previousMonthDate}
          />
          <CalendarMonth
            currentMonthDate={currentMonthDate}
            filteredValues={filteredValues}
            posterHeight={posterHeight}
            posterWidth={posterWidth}
            sort={state.sort}
          />
        </div>
      ) : (
        <div className="pt-10">No results.</div>
      )}
    </FilterAndSortContainer>
  );
}
