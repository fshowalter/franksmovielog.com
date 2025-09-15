import { useEffect, useReducer, useRef, useState } from "react";

import type { PosterImageProps } from "~/api/posters";

import {
  ListHeaderButton,
  ListWithFilters,
} from "~/components/ListWithFilters/ListWithFilters";

import type { ActionType, Sort } from "./Viewings.reducer";

import { CalendarMonth } from "./CalendarMonth";
import { Filters } from "./Filters";
import { MonthNavigationHeader } from "./MonthNavigationHeader";
import { Actions, initState, reducer } from "./Viewings.reducer";

export type ViewingsProps = {
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  initialSort: Sort;
  values: ViewingsValue[];
};

export type ViewingsValue = {
  medium?: string;
  posterImageProps: PosterImageProps;
  releaseSequence: number;
  releaseYear: string;
  slug?: string;
  sortTitle: string;
  title: string;
  venue?: string;
  viewingDate: string; // Full date string YYYY-MM-DD
  viewingDay: string;
  viewingMonth: string;
  viewingMonthShort: string;
  viewingSequence: number;
  viewingYear: string;
};

type CalendarViewProps = {
  currentMonth: Date;
  dispatch: React.Dispatch<ActionType>;
  groupedValues: Map<string, ListItemValue[]>;
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
  nextMonth: Date | undefined;
  prevMonth: Date | undefined;
};

export function Viewings({
  distinctMedia,
  distinctReleaseYears,
  distinctVenues,
  distinctViewingYears,
  initialSort,
  values,
}: ViewingsProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );
  const [filterKey, setFilterKey] = useState(0);
  const prevMonthRef = useRef(state.currentMonth);

  // Scroll to top of calendar when month changes
  useEffect(() => {
    if (prevMonthRef.current.getTime() !== state.currentMonth.getTime()) {
      prevMonthRef.current = state.currentMonth;
      if (typeof document !== "undefined") {
        document
          .querySelector("#calendar")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [state.currentMonth]);

  return (
    <ListWithFilters
      filters={
        <Filters
          dispatch={dispatch}
          distinctMedia={distinctMedia}
          distinctReleaseYears={distinctReleaseYears}
          distinctVenues={distinctVenues}
          distinctViewingYears={distinctViewingYears}
          filterValues={state.pendingFilterValues}
          key={filterKey}
        />
      }
      hasActiveFilters={state.hasActiveFilters}
      list={
        <CalendarView
          currentMonth={state.currentMonth}
          dispatch={dispatch}
          groupedValues={state.groupedValues}
          hasNextMonth={state.hasNextMonth}
          hasPrevMonth={state.hasPrevMonth}
          nextMonth={state.nextMonth}
          prevMonth={state.prevMonth}
        />
      }
      listHeaderButtons={
        <ListHeaderButton href="/viewings/stats/" text="stats" />
      }
      onApplyFilters={() => dispatch({ type: Actions.APPLY_PENDING_FILTERS })}
      onClearFilters={() => {
        dispatch({ type: Actions.CLEAR_PENDING_FILTERS });
        setFilterKey((prev) => prev + 1);
      }}
      onFilterDrawerOpen={() => {
        // Increment key to force remount of filter components
        setFilterKey((prev) => prev + 1);
        dispatch({ type: Actions.RESET_PENDING_FILTERS });
      }}
      onResetFilters={() => dispatch({ type: Actions.RESET_PENDING_FILTERS })}
      pendingFilteredCount={state.pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          }),
        sortOptions: (
          <>
            <option value="viewing-date-desc">
              Viewing Date (Newest First)
            </option>
            <option value="viewing-date-asc">
              Viewing Date (Oldest First)
            </option>
          </>
        ),
      }}
      totalCount={state.filteredValues.length}
    />
  );
}

function CalendarView({
  currentMonth,
  dispatch,
  filteredValues,
  hasNextMonth,
  hasPrevMonth,
  nextMonth,
  prevMonth,
}: CalendarViewProps): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-(--breakpoint-desktop)">
      <MonthNavigationHeader
        currentMonth={currentMonth}
        dispatch={dispatch}
        hasNextMonth={hasNextMonth}
        hasPrevMonth={hasPrevMonth}
        nextMonth={nextMonth}
        prevMonth={prevMonth}
      />
      <CalendarMonth
        currentMonth={currentMonth}
        filteredValues={filteredValues}
      />
    </div>
  );
}
