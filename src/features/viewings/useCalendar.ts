import type { ViewingsValue } from "./Viewings";

export type CalendarCellData = {
  date?: number;
  dayOfWeek?: string;
  viewings?: ViewingsValue[];
};

export function useCalendar(
  currentMonth: Date,
  filteredViewings: ViewingsValue[],
) {
  const viewingsForMonth: Map<number, ViewingsValue[]> = new Map();
  const currentUTCMonth = currentMonth.getUTCMonth();
  const currentUTCFullYear = currentMonth.getUTCFullYear();

  for (const viewing of filteredViewings) {
    const viewingDate = new Date(viewing.viewingDate);
    if (
      viewingDate.getUTCMonth() == currentUTCMonth &&
      viewingDate.getUTCFullYear() == currentUTCFullYear
    ) {
      viewingsForMonth.set(
        viewingDate.getUTCDate(),
        viewingsForMonth.get(viewingDate.getUTCDate()) || [],
      );

      viewingsForMonth.get(viewingDate.getUTCDate())?.push(viewing);
    }
  }

  const cells = getCalendarCells(currentMonth, viewingsForMonth);
  const rows = getCalendarRows(cells);

  return rows;
}

function getCalendarCells(
  month: Date,
  viewingsForMonth: Map<number, ViewingsValue[]>,
): CalendarCellData[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
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
