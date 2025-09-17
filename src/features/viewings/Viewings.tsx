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
  const prevMonthRef = useRef(state.selectedMonthDate);

  // Scroll to top of calendar when month changes
  useEffect(() => {
    if (prevMonthRef.current !== state.selectedMonthDate) {
      prevMonthRef.current = state.selectedMonthDate;
      if (typeof document !== "undefined") {
        document
          .querySelector("#calendar")
          ?.scrollIntoView({ behavior: "smooth" });
      }
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

  const hasPendingFilters = selectHasPendingFilters(state);

  const [previousMonthDate, currentMonthDate, nextMonthDate] =
    useMonthNavigation(filteredValues, state.sort, state.selectedMonthDate);

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
            sort={state.sort}
          />
        </div>
      ) : (
        <div className="pt-10">No results.</div>
      )}
    </FilterAndSortContainer>
  );
}
