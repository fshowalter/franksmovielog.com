import { useEffect, useReducer, useRef } from "react";

import type { PosterImageProps } from "~/api/posters";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { FilterAndSortHeaderLink } from "~/components/filter-and-sort/FilterAndSortHeaderLink";
import { useFilteredValues } from "~/hooks/useFilteredValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { ViewingsSort } from "./sortViewings";

import { CalendarMonth } from "./CalendarMonth";
import { Filters } from "./Filters";
import { filterViewings } from "./filterViewings";
import { MonthNavigationHeader } from "./MonthNavigationHeader";
import { sortViewings } from "./sortViewings";
import { useMonthNavigation } from "./useMonthNavigation";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createResetFiltersAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./Viewings.reducer";

export type ViewingsProps = {
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  initialSort: ViewingsSort;
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
    createInitialState,
  );
  const prevMonthRef = useRef(state.currentMonth);

  // Scroll to top of calendar when month changes
  useEffect(() => {
    if (prevMonthRef.current !== state.currentMonth) {
      prevMonthRef.current = state.currentMonth;
      if (typeof document !== "undefined") {
        document
          .querySelector("#calendar")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [state.currentMonth]);

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

  const hasPendingFilters = selectHasPendingFilters(state);

  const [previousMonth, currentMonth, nextMonth] = useMonthNavigation(
    state.currentMonth,
    filteredValues,
    state.sort,
  );

  return (
    <FilterAndSortContainer
      filters={
        <Filters
          dispatch={dispatch}
          distinctMedia={distinctMedia}
          distinctReleaseYears={distinctReleaseYears}
          distinctVenues={distinctVenues}
          distinctViewingYears={distinctViewingYears}
          filterValues={state.pendingFilterValues}
        />
      }
      hasPendingFilters={hasPendingFilters}
      headerLinks={
        <FilterAndSortHeaderLink href="/viewings/stats/" text="stats" />
      }
      onApplyFilters={() => dispatch(createApplyFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearFiltersAction());
      }}
      onFilterDrawerOpen={() => {
        dispatch(createResetFiltersAction());
      }}
      onResetFilters={() => dispatch(createResetFiltersAction())}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (e) =>
          dispatch(createSortAction(e.target.value as ViewingsSort)),
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
      totalCount={filteredValues.length}
    >
      <div className="mx-auto w-full max-w-(--breakpoint-desktop)">
        <MonthNavigationHeader
          dispatch={dispatch}
          firstValue={currentMonth!}
          nextMonth={nextMonth}
          prevMonth={previousMonth}
        />
        <CalendarMonth
          currentMonth={state.currentMonth}
          filteredValues={filteredValues}
          sort={state.sort}
        />
      </div>
    </FilterAndSortContainer>
  );
}
