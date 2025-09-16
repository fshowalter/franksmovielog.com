import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

export type CalendarCellData = {
  date?: number;
  dayOfWeek?: string;
  viewings?: ViewingsValue[];
};

export function useCalendar(
  currentMonth: {
    month: string;
    year: string;
  },
  filteredViewings: ViewingsValue[],
  sort: ViewingsSort,
) {
  const viewingsForMonth: Map<string, ViewingsValue[]> = new Map();

  for (const viewing of filteredViewings) {
    if (
      viewing.viewingMonthShort == currentMonth.month &&
      viewing.viewingYear == currentMonth.year
    ) {
      viewingsForMonth.set(
        viewing.viewingDate.slice(-2),
        viewingsForMonth.get(viewing.viewingDate.slice(-2)) || [],
      );

      viewingsForMonth.get(viewing.viewingDate.slice(-2))?.push(viewing);
    }

    if (
      sort === "viewing-date-desc" &&
      viewing.viewingMonthShort < currentMonth.month &&
      viewing.viewingYear < currentMonth.year
    ) {
      break;
    }

    if (
      sort === "viewing-date-asc" &&
      viewing.viewingMonthShort > currentMonth.month &&
      viewing.viewingYear > currentMonth.year
    ) {
      break;
    }
  }

  for (const values of viewingsForMonth.values()) {
    values.sort((a, b) => a.viewingSequence - b.viewingSequence);
  }

  const cells = getCalendarCells(viewingsForMonth);
  const rows = getCalendarRows(cells);

  return rows;
}

function getCalendarCells(
  viewingsForMonth: Map<string, ViewingsValue[]>,
): CalendarCellData[] {
  const firstViewing = viewingsForMonth.values().next().value![0];

  const firstViewingDate = new Date(firstViewing.viewingDate);

  const year = firstViewingDate.getFullYear();
  const monthIndex = firstViewingDate.getMonth();
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
    const viewings = viewingsForMonth.get(String(date).padStart(2, "0")) || [];
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
