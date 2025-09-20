import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

import { CalendarCell } from "./CalendarCell";
import { useCalendar } from "./useCalendar";

/**
 * Renders a monthly calendar view of movie viewings.
 * @param props - Component props
 * @param props.currentMonthDate - Date string for the month to display
 * @param props.filteredValues - Array of filtered viewing values
 * @param props.sort - Current sort order
 * @returns Calendar table with viewing data
 */
export function CalendarMonth({
  currentMonthDate,
  filteredValues,
  sort,
}: {
  currentMonthDate: string;
  filteredValues: ViewingsValue[];
  sort: ViewingsSort;
}): React.JSX.Element {
  const rows = useCalendar(currentMonthDate, filteredValues, sort);

  return (
    <div
      className={`
        scroll-mt-(--calendar-scroll-offset)
        [--calendar-scroll-offset:calc(var(--filter-and-sort-container-scroll-offset)_+_92px)]
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
            hidden transform-gpu bg-calendar
            tablet-landscape:sticky
            tablet-landscape:top-(--calendar-scroll-offset)
            tablet-landscape:z-sticky tablet-landscape:table-header-group
          `}
        >
          <tr className={`tablet-landscape:shadow-all`}>
            <WeekdayHeader value="Sun" />
            <WeekdayHeader value="Mon" />
            <WeekdayHeader value="Tue" />
            <WeekdayHeader value="Wed" />
            <WeekdayHeader value="Thu" />
            <WeekdayHeader value="Fri" />
            <WeekdayHeader value="Sat" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr className="tablet-landscape:table-row" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <CalendarCell key={`${rowIndex}-${cellIndex}`} value={cell} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WeekdayHeader({ value }: { value: string }): React.JSX.Element {
  return (
    <th
      className={`
        border-separate border border-default px-2 py-3 text-center font-sans
        text-sm font-normal tracking-wide text-subtle uppercase
      `}
    >
      {value}
    </th>
  );
}
