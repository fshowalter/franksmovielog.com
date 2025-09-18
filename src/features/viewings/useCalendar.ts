import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

export type CalendarCellData = {
  date?: number;
  dayOfWeek?: string;
  viewings?: ViewingsValue[];
};

/**
 * Hook to generate calendar grid data for displaying viewings in a monthly calendar.
 * @param currentMonthDate - Date string for the current month to display
 * @param filteredValues - Array of filtered viewing values
 * @param sort - Current sort order for optimized iteration
 * @returns Array of calendar rows with cells containing viewing data
 */
export function useCalendar(
  currentMonthDate: string,
  filteredValues: ViewingsValue[],
  sort: ViewingsSort,
) {
  const viewingsForMonth: Map<number, ViewingsValue[]> = new Map();
  const currentYearAndMonth = currentMonthDate.slice(0, 7);

  for (const value of filteredValues) {
    if (value.viewingDate.startsWith(currentYearAndMonth)) {
      const viewingDay = Number(value.viewingDate.slice(-2));
      viewingsForMonth.set(viewingDay, viewingsForMonth.get(viewingDay) || []);

      viewingsForMonth.get(viewingDay)?.push(value);
    }

    const valueYearAndMonth = value.viewingDate.slice(0, 7);

    if (
      sort === "viewing-date-desc" &&
      valueYearAndMonth < currentYearAndMonth
    ) {
      break;
    }

    if (
      sort === "viewing-date-asc" &&
      valueYearAndMonth > currentYearAndMonth
    ) {
      break;
    }
  }

  for (const values of viewingsForMonth.values()) {
    values.sort((a, b) => a.viewingSequence - b.viewingSequence);
  }

  const cells = getCalendarCells(currentMonthDate, viewingsForMonth);
  const rows = getCalendarRows(cells);

  return rows;
}

function getCalendarCells(
  currentMonthDate: string,
  viewingsForMonth: Map<number, ViewingsValue[]>,
): CalendarCellData[] {
  const firstViewingDate = new Date(currentMonthDate);

  const year = firstViewingDate.getUTCFullYear();
  const monthIndex = firstViewingDate.getUTCMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells: CalendarCellData[] = [];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add empty cells for days before month starts
  for (let i = 0; i < startPadding; i++) {
    cells.push({});
  }

  // Add days of the month
  for (let date = 1; date <= daysInMonth; date++) {
    const currentDate = new Date(year, monthIndex, date);
    const dayOfWeek = weekdays[currentDate.getDay()];
    const viewings = viewingsForMonth.get(date) || [];
    // Viewings are already sorted

    cells.push({
      date,
      dayOfWeek,
      viewings,
    });
  }

  // Fill remaining cells to complete the grid
  while (cells.length % 7 !== 0) {
    cells.push({});
  }

  return cells;
}

function getCalendarRows(cells: CalendarCellData[]): CalendarCellData[][] {
  const rows: CalendarCellData[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}
