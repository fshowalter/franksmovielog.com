import {
  buildGroupValues,
  createListReducer,
} from "~/api/reducers/listReducerFactory";
import { getGroupLetter } from "~/utils/getGroupLetter";
import { sortNumber, sortString } from "~/utils/sortTools";

import type { ListItemValue } from "./CastAndCrew";

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

// Sort map for cast and crew
const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> = {
  "name-asc": (a, b) => sortString(a.name, b.name),
  "name-desc": (a, b) => sortString(a.name, b.name) * -1,
  "review-count-asc": (a, b) => sortNumber(a.reviewCount, b.reviewCount),
  "review-count-desc": (a, b) => sortNumber(a.reviewCount, b.reviewCount) * -1,
};

// Group function for cast and crew
function groupForValue(item: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "name-asc":
    case "name-desc": {
      return getGroupLetter(item.name);
    }
    case "review-count-asc":
    case "review-count-desc": {
      return "";
    }
    // no default
  }
}

// Create the reducer using the factory
const reducerConfig = {
  customGroupValues: buildGroupValues(groupForValue),
  filters: {
    custom: {
      FILTER_CREDIT_KIND: {
        actionType: "FILTER_CREDIT_KIND",
        clearable: true,
        filterFn: (value: string) => (item: ListItemValue) => {
          return item.creditedAs.includes(value);
        },
      },
      FILTER_NAME: {
        actionType: "FILTER_NAME",
        filterFn: (value: string) => {
          const regex = new RegExp(value, "i");
          return (item: ListItemValue) => regex.test(item.name);
        },
      },
    },
  },
  initialSort: "name-asc" as Sort,
  sortMap,
} as const;

export const { Actions, initState, reducer } = createListReducer<
  ListItemValue,
  Sort,
  Map<string, ListItemValue[]>
>(reducerConfig);

// Export action types for compatibility
export type ActionType =
  | { type: "FILTER_CREDIT_KIND"; value: string }
  | { type: "FILTER_NAME"; value: string }
  | { type: "SHOW_MORE" }
  | { type: "SORT"; value: Sort };
