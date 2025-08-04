import type { ReviewListItemValue } from "~/components/ReviewListItem";

import {
  buildGroupValues,
  createListReducer,
} from "~/api/reducers/listReducerFactory";
import { getGroupLetter } from "~/utils/getGroupLetter";
import { collator, sortNumber, sortString } from "~/utils/sortTools";

type ReviewsSort =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc";

// Sort map for reviews
const sortMap: Record<
  ReviewsSort,
  (a: ReviewListItemValue, b: ReviewListItemValue) => number
> = {
  "grade-asc": (a, b) => sortNumber(a.gradeValue ?? 0, b.gradeValue ?? 0),
  "grade-desc": (a, b) => sortNumber(a.gradeValue ?? 0, b.gradeValue ?? 0) * -1,
  "release-date-asc": (a, b) =>
    sortString(a.releaseSequence, b.releaseSequence),
  "release-date-desc": (a, b) =>
    sortString(a.releaseSequence, b.releaseSequence) * -1,
  "review-date-asc": (a, b) => sortString(a.reviewSequence, b.reviewSequence),
  "review-date-desc": (a, b) =>
    sortString(a.reviewSequence, b.reviewSequence) * -1,
  "title-asc": (a, b) => collator.compare(a.sortTitle, b.sortTitle),
  "title-desc": (a, b) => collator.compare(a.sortTitle, b.sortTitle) * -1,
};

// Helper function for review date grouping
function getReviewDateGroup(value: ReviewListItemValue): string {
  if (value.reviewMonth) {
    return `${value.reviewMonth} ${value.reviewYear}`;
  }
  return value.reviewYear;
}

// Group function for reviews
function groupForValue(
  value: ReviewListItemValue,
  sortValue: ReviewsSort,
): string {
  switch (sortValue) {
    case "grade-asc":
    case "grade-desc": {
      return value.grade;
    }
    case "release-date-asc":
    case "release-date-desc": {
      return value.year;
    }
    case "review-date-asc":
    case "review-date-desc": {
      return getReviewDateGroup(value);
    }
    case "title-asc":
    case "title-desc": {
      return getGroupLetter(value.sortTitle);
    }
    // should never get here
    default: {
      return "";
    }
  }
}

// Create the reducer using the factory
export const { Actions, initState, reducer } = createListReducer<
  ReviewListItemValue,
  ReviewsSort,
  Map<string, ReviewListItemValue[]>
>({
  customGroupValues: buildGroupValues(groupForValue),
  filters: {
    custom: {
      FILTER_GENRES: {
        actionType: "FILTER_GENRES",
        filterFn:
          (values: readonly string[]) => (item: ReviewListItemValue) => {
            return values.every((genre) => item.genres.includes(genre));
          },
      },
      FILTER_GRADE: {
        actionType: "FILTER_GRADE",
        filterFn: (values: [number, number]) => (item: ReviewListItemValue) => {
          const gradeValue = item.gradeValue;
          if (gradeValue === undefined) {
            return false;
          }
          return gradeValue >= values[0] && gradeValue <= values[1];
        },
      },
    },
    releaseYear: true,
    reviewYear: true,
    title: true,
  },
  initialSort: "review-date-desc",
  sortMap,
});

// Export action types for compatibility
export type ActionType =
  | { type: typeof Actions.FILTER_GENRES; values: readonly string[] }
  | { type: typeof Actions.FILTER_GRADE; values: [number, number] }
  | { type: typeof Actions.FILTER_RELEASE_YEAR; values: [string, string] }
  | { type: typeof Actions.FILTER_REVIEW_YEAR; values: [string, string] }
  | { type: typeof Actions.FILTER_TITLE; value: string }
  | { type: typeof Actions.SHOW_MORE }
  | { type: typeof Actions.SORT; value: ReviewsSort };

// Re-export sort type for convenience
export type Sort = ReviewsSort;
