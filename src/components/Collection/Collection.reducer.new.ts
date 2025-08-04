import {
  buildGroupValues,
  createListReducer,
} from "~/api/reducers/listReducerFactory";
import { getGroupLetter } from "~/utils/getGroupLetter";
import { collator, sortNumber, sortString } from "~/utils/sortTools";

import type { ListItemValue } from "./Collection";

export type Sort =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title";

// Sort map for collection
const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> = {
  "grade-asc": (a, b) => sortNumber(a.gradeValue ?? 50, b.gradeValue ?? 50),
  "grade-desc": (a, b) =>
    sortNumber(a.gradeValue ?? -1, b.gradeValue ?? -1) * -1,
  "release-date-asc": (a, b) =>
    sortString(a.releaseSequence, b.releaseSequence),
  "release-date-desc": (a, b) =>
    sortString(a.releaseSequence, b.releaseSequence) * -1,
  "review-date-asc": (a, b) =>
    sortString(a.reviewSequence ?? "9999", b.reviewSequence ?? "9999"),
  "review-date-desc": (a, b) =>
    sortString(a.reviewSequence ?? "0", b.reviewSequence ?? "0") * -1,
  title: (a, b) => collator.compare(a.sortTitle, b.sortTitle),
};

// Group function for collection
function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "grade-asc":
    case "grade-desc": {
      return value.grade ?? "Unrated";
    }
    case "release-date-asc":
    case "release-date-desc": {
      return value.year.toString();
    }
    case "review-date-asc":
    case "review-date-desc": {
      return value.reviewYear.toString();
    }
    case "title": {
      return getGroupLetter(value.sortTitle);
    }
    // no default
  }
}

// Create the reducer using the factory
const reducerConfig = {
  additionalState: {
    hideReviewed: false,
  },
  customGroupValues: buildGroupValues(groupForValue),
  filters: {
    releaseYear: true,
    reviewed: (item: ListItemValue) => !item.slug, // Collection's specific reviewed check
    reviewYear: true,
    title: true,
  },
  initialSort: "release-date-desc",
  sortMap,
} as const;

export const { Actions, initState, reducer } = createListReducer<
  ListItemValue,
  Sort,
  Map<string, ListItemValue[]>
>(reducerConfig);

// Export action types for compatibility
export type ActionType =
  | { type: "FILTER_RELEASE_YEAR"; values: [string, string] }
  | { type: "FILTER_REVIEW_YEAR"; values: [string, string] }
  | { type: "FILTER_TITLE"; value: string }
  | { type: "SHOW_MORE" }
  | { type: "SORT"; value: Sort }
  | { type: "TOGGLE_REVIEWED" };
