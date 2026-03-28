import { useEffect, useReducer, useRef } from "react";

import type { PosterImageProps } from "~/assets/posters";
import type { SortOption } from "~/components/filter-and-sort/FilterAndSortContainer";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { useFilteredValues } from "~/hooks/useFilteredValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { ViewingsSort } from "./sortViewings";

import { buildAppliedFilterChips } from "./appliedFilterChips";
import { CalendarMonth } from "./CalendarMonth";
import { filterViewings } from "./filterViewings";
import { MonthNavigationHeader } from "./MonthNavigationHeader";
import { sortViewings } from "./sortViewings";
import { useMonthNavigation } from "./useMonthNavigation";
import {
  createInitialState,
  createSortAction,
  reducer,
} from "./Viewings.reducer";
import { ViewingsFilters } from "./ViewingsFilters";

const VIEWINGS_SORT_OPTIONS: readonly SortOption[] = [
  { label: "Viewing Date (Newest First)", value: "viewing-date-desc" },
  { label: "Viewing Date (Oldest First)", value: "viewing-date-asc" },
] as const;

/**
 * Props for the Viewings component.
 */
export type ViewingsProps = {
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  initialSort: ViewingsSort;
  values: ViewingsValue[];
};

/**
 * Value object for a viewing item.
 */
export type ViewingsValue = {
  date: string; // Full date string YYYY-MM-DD
  medium?: string;
  posterImageProps: PosterImageProps;
  releaseYear: string;
  reviewSlug?: string;
  sequence: string;
  sortTitle: string;
  title: string;
  venue?: string;
  viewingYear: string;
};

/**
 * Component for displaying viewing history with calendar view.
 * @param props - Component props
 * @param props.distinctMedia - Available media types for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctVenues - Available venues for filtering
 * @param props.distinctViewingYears - Available viewing years for filtering
 * @param props.initialSort - Initial sort configuration
 * @param props.values - Viewing values to display
 * @returns Viewings component with calendar view and filtering
 */
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

  // AIDEV-NOTE: Applied filters only show after clicking "View X results" to avoid layout shift
  const activeFilters = buildAppliedFilterChips(state.activeFilterValues, {
    distinctReleaseYears,
    distinctViewingYears,
  });

  const [previousMonthDate, currentMonthDate, nextMonthDate] =
    useMonthNavigation(filteredValues, state.sort, state.selectedMonthDate);

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      createSortAction={createSortAction}
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
      sortOptions={VIEWINGS_SORT_OPTIONS}
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
            sort={state.sort}
          />
        </div>
      ) : (
        <div className="pt-10">No results.</div>
      )}
    </FilterAndSortContainer>
  );
}
