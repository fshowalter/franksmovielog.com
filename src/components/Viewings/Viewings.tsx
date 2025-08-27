import type { JSX } from "react";

import { useEffect, useReducer, useRef, useState } from "react";

import type { PosterImageProps } from "~/api/posters";
import type { Viewing } from "~/api/viewings";

import { ListItemMediumAndVenue } from "~/components/ListItemMediumAndVenue";
import { ListItemTitle } from "~/components/ListItemTitle";
import {
  ListHeaderButton,
  ListWithFilters,
} from "~/components/ListWithFilters";
import { PosterListItem } from "~/components/PosterList";

import { Filters, SortOptions } from "./Filters";
import {
  Actions,
  type ActionType,
  initState,
  reducer,
  type Sort,
} from "./Viewings.reducer";

export type ListItemValue = Pick<
  Viewing,
  | "medium"
  | "releaseSequence"
  | "releaseYear"
  | "slug"
  | "sortTitle"
  | "title"
  | "venue"
  | "viewingSequence"
  | "viewingYear"
> & {
  posterImageProps: PosterImageProps;
  viewingDate: string; // Full date string YYYY-MM-DD
  viewingDay: string;
  viewingMonth: string;
  viewingMonthShort: string;
};

export type Props = {
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
};

type CalendarDayData = {
  date: number | undefined;
  viewings: ListItemValue[];
  weekday?: string;
};

type CalendarHeaderProps = {
  currentMonth: Date;
  dispatch: React.Dispatch<ActionType>;
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
  nextMonth: Date | undefined;
  prevMonth: Date | undefined;
};

type CalendarMonthProps = {
  currentMonth: Date;
  groupedValues: Map<string, ListItemValue[]>;
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
}: Props): JSX.Element {
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
        sortOptions: <SortOptions />,
      }}
      totalCount={state.filteredValues.length}
    />
  );
}

function CalendarDay({ day }: { day: CalendarDayData }): JSX.Element {
  if (!day.date) {
    return (
      <td
        className={`
          hidden min-h-[100px] border border-default bg-transparent p-2
          align-top
          tablet-landscape:table-cell
        `}
      />
    );
  }

  const weekday = day.weekday!; // Always defined for days with dates

  return (
    <td
      className={`
        mb-2 block min-h-[100px] w-full border-default bg-default py-2 align-top
        tablet:border tablet:px-2
        tablet-landscape:mb-0 tablet-landscape:table-cell
        tablet-landscape:w-[14.28%]
        ${day.viewings.length === 0 ? `hidden` : ""}
      `}
      data-weekday={weekday}
    >
      <div
        className={`
          mb-1 px-container text-sm font-medium
          tablet:px-6 tablet:text-xl tablet:font-normal
          ${day.viewings.length > 0 ? "text-default" : "text-muted"}
        `}
      >
        <span
          className={`
            mr-2 font-sans text-xs font-light text-subtle uppercase
            tablet-landscape:hidden
          `}
        >
          {weekday}
        </span>
        {day.date}
      </div>
      {day.viewings.length > 0 && (
        <div className="@container/poster-list">
          <ol
            className={`
              flex flex-col
              [--poster-list-item-width:33.33%]
              tablet:flex-row tablet:flex-wrap
              tablet-landscape:flex-col
              tablet-landscape:[--poster-list-item-width:100%]
              @min-[calc((250px_*_3)_+_1px)]/poster-list:[--poster-list-item-width:25%]
            `}
          >
            {day.viewings.map((viewing) => (
              <PosterListItem
                className="items-center"
                key={viewing.viewingSequence}
                posterImageProps={viewing.posterImageProps}
              >
                <div
                  className={`
                    flex grow flex-col items-start gap-y-1
                    tablet:mt-2 tablet:w-full tablet:px-1
                  `}
                >
                  <ListItemTitle
                    slug={viewing.slug}
                    title={viewing.title}
                    year={viewing.releaseYear}
                  />
                  <ListItemMediumAndVenue
                    medium={viewing.medium}
                    venue={viewing.venue}
                  />
                </div>
              </PosterListItem>
            ))}
          </ol>
        </div>
      )}
    </td>
  );
}

function CalendarHeader({
  currentMonth,
  dispatch,
  hasNextMonth,
  hasPrevMonth,
  nextMonth,
  prevMonth,
}: CalendarHeaderProps): JSX.Element {
  const monthName = currentMonth.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });

  const prevMonthName = prevMonth
    ? prevMonth.toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
        year: "numeric",
      })
    : "";

  const nextMonthName = nextMonth
    ? nextMonth.toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
        year: "numeric",
      })
    : "";

  return (
    <div
      className={`
        sticky top-(--list-scroll-offset) z-sticky flex
        max-w-(--breakpoint-desktop) items-center justify-between border-b
        border-default bg-subtle px-container py-4
        tablet:-mx-(--container-padding) tablet:py-6
        tablet-landscape:py-8
        desktop:-mx-0 desktop:px-0
      `}
    >
      <div className="w-1/3">
        {hasPrevMonth && (
          <button
            aria-disabled={false}
            aria-label={`Navigate to previous month: ${prevMonthName}`}
            className={`
              -mb-1 transform-gpu cursor-pointer pb-1 font-sans text-sm
              font-bold text-accent transition-transform
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-bottom-right after:scale-x-0 after:bg-accent
              after:transition-transform
              hover:after:scale-x-100
              tablet-landscape:tracking-wide tablet-landscape:uppercase
            `}
            onClick={() => dispatch({ type: Actions.PREV_MONTH })}
          >
            ← {prevMonthName}
          </button>
        )}
      </div>
      <h2
        className={`
          w-1/3 text-center text-base font-medium
          tablet:text-lg
          tablet-landscape:text-xl
        `}
      >
        {monthName}
      </h2>
      <div className="w-1/3 text-right">
        {hasNextMonth && (
          <button
            aria-disabled={false}
            aria-label={`Navigate to next month: ${nextMonthName}`}
            className={`
              -mb-1 transform-gpu cursor-pointer pb-1 font-sans text-sm
              font-bold text-accent transition-transform
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-bottom-left after:scale-x-0 after:bg-accent
              after:transition-transform
              hover:after:scale-x-100
              tablet-landscape:tracking-wide tablet-landscape:uppercase
            `}
            onClick={() => dispatch({ type: Actions.NEXT_MONTH })}
          >
            {nextMonthName} →
          </button>
        )}
      </div>
    </div>
  );
}

function CalendarMonth({
  currentMonth,
  groupedValues,
}: CalendarMonthProps): JSX.Element {
  const calendarDays = getCalendarDays(currentMonth, groupedValues);
  const weeks = getCalendarWeeks(calendarDays);

  return (
    <div
      className={`
        scroll-mt-(--calendar-scroll-offset)
        [--calendar-scroll-offset:calc(var(--list-scroll-offset)_+_92px)]
        tablet:mt-8
        tablet-landscape:mt-16
      `}
      data-testid="calendar"
      id="calendar"
    >
      <table
        className={`
          w-full border-default
          tablet-landscape:border-collapse tablet-landscape:border
        `}
      >
        <thead
          className={`
            hidden transform-gpu bg-default
            tablet-landscape:sticky
            tablet-landscape:top-(--calendar-scroll-offset)
            tablet-landscape:z-sticky tablet-landscape:table-header-group
          `}
        >
          <tr className={`tablet-landscape:shadow-all`}>
            <WeekdayHeader>Sun</WeekdayHeader>
            <WeekdayHeader> Mon</WeekdayHeader>
            <WeekdayHeader>Tue</WeekdayHeader>
            <WeekdayHeader>Wed</WeekdayHeader>
            <WeekdayHeader>Thu</WeekdayHeader>
            <WeekdayHeader>Fri</WeekdayHeader>
            <WeekdayHeader>Sat</WeekdayHeader>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr className="tablet-landscape:table-row" key={weekIndex}>
              {week.map((day, dayIndex) => (
                <CalendarDay day={day} key={`${weekIndex}-${dayIndex}`} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalendarView({
  currentMonth,
  dispatch,
  groupedValues,
  hasNextMonth,
  hasPrevMonth,
  nextMonth,
  prevMonth,
}: CalendarViewProps): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-(--breakpoint-desktop)">
      <CalendarHeader
        currentMonth={currentMonth}
        dispatch={dispatch}
        hasNextMonth={hasNextMonth}
        hasPrevMonth={hasPrevMonth}
        nextMonth={nextMonth}
        prevMonth={prevMonth}
      />
      <CalendarMonth
        currentMonth={currentMonth}
        groupedValues={groupedValues}
      />
    </div>
  );
}

function getCalendarDays(
  month: Date,
  groupedValues: Map<string, ListItemValue[]>,
): CalendarDayData[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: CalendarDayData[] = [];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add empty cells for days before month starts
  for (let i = 0; i < startPadding; i++) {
    days.push({ date: undefined, viewings: [] });
  }

  // Add days of the month
  for (let date = 1; date <= daysInMonth; date++) {
    const currentDate = new Date(year, monthIndex, date);
    const weekday = weekdays[currentDate.getDay()];

    // Use pre-indexed viewings for O(1) lookup
    // Key format: "year-month-day" without padding
    const dateKey = `${year}-${monthIndex + 1}-${date}`;
    const dayViewings = groupedValues.get(dateKey) || [];
    // Viewings are already sorted in the reducer

    days.push({
      date,
      viewings: dayViewings,
      weekday,
    });
  }

  // Fill remaining cells to complete the grid
  while (days.length % 7 !== 0) {
    days.push({ date: undefined, viewings: [] });
  }

  return days;
}

function getCalendarWeeks(days: CalendarDayData[]): CalendarDayData[][] {
  const weeks: CalendarDayData[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

function WeekdayHeader({ children }: { children: React.ReactNode }) {
  return (
    <th
      className={`
        border-separate border border-default px-2 py-3 text-center font-sans
        text-sm font-normal tracking-wide text-subtle uppercase
      `}
    >
      {children}
    </th>
  );
}
