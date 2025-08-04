import {
  buildGroupValues,
  createListReducer,
} from "~/api/reducers/listReducerFactory";
import { getGroupLetter } from "~/utils/getGroupLetter";
import { collator, sortString } from "~/utils/sortTools";

import type { ListItemValue } from "./Watchlist";

export type Sort = "release-date-asc" | "release-date-desc" | "title";

// Sort map for watchlist
const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> = {
  "release-date-asc": (a, b) =>
    sortString(a.releaseSequence, b.releaseSequence),
  "release-date-desc": (a, b) =>
    sortString(a.releaseSequence, b.releaseSequence) * -1,
  title: (a, b) => collator.compare(a.sortTitle, b.sortTitle),
};

// Custom group function for watchlist
function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "release-date-asc":
    case "release-date-desc": {
      return value.year;
    }
    case "title": {
      return getGroupLetter(value.sortTitle);
    }
    // no default
  }
}

// Create the reducer using the factory
export const { Actions, initState, reducer } = createListReducer<
  ListItemValue,
  Sort,
  Map<string, ListItemValue[]>
>({
  additionalState: {
    hideReviewed: false,
  },
  customGroupValues: buildGroupValues(groupForValue),
  filters: {
    custom: {
      FILTER_COLLECTION: {
        actionType: "FILTER_COLLECTION",
        filterFn: (value: string) => (item: ListItemValue) => {
          return item.collectionNames.includes(value);
        },
      },
      FILTER_DIRECTOR: {
        actionType: "FILTER_DIRECTOR",
        filterFn: (value: string) => (item: ListItemValue) => {
          return item.directorNames.includes(value);
        },
      },
      FILTER_PERFORMER: {
        actionType: "FILTER_PERFORMER",
        filterFn: (value: string) => (item: ListItemValue) => {
          return item.performerNames.includes(value);
        },
      },
      FILTER_WRITER: {
        actionType: "FILTER_WRITER",
        filterFn: (value: string) => (item: ListItemValue) => {
          return item.writerNames.includes(value);
        },
      },
    },
    releaseYear: true,
    title: true,
  },
  initialSort: "release-date-desc",
  sortMap,
});

// Export action types for compatibility
export type ActionType =
  | { type: typeof Actions.FILTER_COLLECTION; value: string }
  | { type: typeof Actions.FILTER_DIRECTOR; value: string }
  | { type: typeof Actions.FILTER_PERFORMER; value: string }
  | { type: typeof Actions.FILTER_RELEASE_YEAR; values: [string, string] }
  | { type: typeof Actions.FILTER_TITLE; value: string }
  | { type: typeof Actions.FILTER_WRITER; value: string }
  | { type: typeof Actions.SHOW_MORE }
  | { type: typeof Actions.SORT; value: Sort };
