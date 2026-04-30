import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

import { CalendarCell } from "./CalendarCell";
import { useCalendar } from "./useCalendar";

export function CalendarMonth({
  currentMonthDate,
  filteredValues,
  posterHeight,
  posterWidth,
  sort,
}: {
  currentMonthDate: string;
  filteredValues: ViewingsValue[];
  posterHeight: number;
  posterWidth: number;
  sort: ViewingsSort;
}): React.JSX.Element {
  const rows = useCalendar(currentMonthDate, filteredValues, sort);

  return (
    <div
      className={`
        scroll-mt-(--calendar-scroll-offset) px-px
        [--calendar-scroll-offset:calc(var(--filter-and-sort-container-scroll-offset)+93px)]
        tablet:mt-8
        tablet-landscape:mt-16
      `}
      data-testid="calendar"
      id="calendar"
    >
      <table className={`w-full border-default`}>
        <thead
          className={`
            hidden bg-calendar
            tablet-landscape:sticky
            tablet-landscape:top-(--calendar-scroll-offset)
            tablet-landscape:z-above tablet-landscape:table-header-group
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
                <CalendarCell
                  key={`${rowIndex}-${cellIndex}`}
                  posterHeight={posterHeight}
                  posterWidth={posterWidth}
                  value={cell}
                />
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
        bg-calendar px-2 py-3 text-center font-sans text-sm font-normal
        tracking-wide text-subtle uppercase shadow-all
      `}
    >
      {value}
    </th>
  );
}
