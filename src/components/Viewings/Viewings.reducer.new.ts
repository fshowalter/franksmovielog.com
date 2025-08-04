import { createListReducer } from "~/api/reducers/listReducerFactory";
import { sortNumber } from "~/utils/sortTools";

import type { ListItemValue } from "./Viewings";

export type Sort = "viewing-date-asc" | "viewing-date-desc";

// Sort map for viewings
const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> = {
  "viewing-date-asc": (a, b) => sortNumber(a.sequence, b.sequence),
  "viewing-date-desc": (a, b) => sortNumber(a.sequence, b.sequence) * -1,
};

// Custom nested grouping for viewings (by month/year then by day)
function customGroupValues(
  values: ListItemValue[],
): Map<string, Map<string, ListItemValue[]>> {
  const groupedValues = new Map<string, Map<string, ListItemValue[]>>();

  for (const value of values) {
    const monthYearGroup = `${value.viewingMonth} ${value.viewingYear}`;

    let groupValue = groupedValues.get(monthYearGroup);

    if (!groupValue) {
      groupValue = new Map<string, ListItemValue[]>();
      groupedValues.set(monthYearGroup, groupValue);
    }

    const dayGroup = `${value.viewingDay}-${value.viewingDate}-${value.viewingMonthShort}-${value.viewingYear}`;

    let dayGroupValue = groupValue.get(dayGroup);

    if (!dayGroupValue) {
      dayGroupValue = [];
      groupValue.set(dayGroup, dayGroupValue);
    }

    dayGroupValue.push(value);
  }

  return groupedValues;
}

// Create the reducer using the factory
const reducerConfig = {
  customGroupValues,
  filters: {
    custom: {
      FILTER_MEDIUM: {
        actionType: "FILTER_MEDIUM",
        clearable: true,
        filterFn: (value: string) => (item: ListItemValue) => {
          return item.medium === value;
        },
      },
      FILTER_VENUE: {
        actionType: "FILTER_VENUE",
        clearable: true,
        filterFn: (value: string) => (item: ListItemValue) => {
          return item.venue === value;
        },
      },
      FILTER_VIEWING_YEAR: {
        actionType: "FILTER_VIEWING_YEAR",
        filterFn: (values: [string, string]) => (item: ListItemValue) => {
          return item.viewingYear >= values[0] && item.viewingYear <= values[1];
        },
      },
    },
    releaseYear: true,
    title: true,
  },
  groupByLetter: false, // Viewings doesn't use letter grouping
  initialSort: "viewing-date-desc",
  sortMap,
} as const;

export const { Actions, initState, reducer } = createListReducer<
  ListItemValue,
  Sort,
  Map<string, Map<string, ListItemValue[]>>
>(reducerConfig);

// Export action types for compatibility
export type ActionType =
  | { type: "FILTER_MEDIUM"; value: string }
  | { type: "FILTER_RELEASE_YEAR"; values: [string, string] }
  | { type: "FILTER_TITLE"; value: string }
  | { type: "FILTER_VENUE"; value: string }
  | { type: "FILTER_VIEWING_YEAR"; values: [string, string] }
  | { type: "SHOW_MORE" }
  | { type: "SORT"; value: Sort };
