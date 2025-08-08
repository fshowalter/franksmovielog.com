import type { ReviewListItemValue } from "~/components/ReviewListItem";

import { getGroupLetter } from "~/utils/getGroupLetter";
import {
  buildGroupValues,
  type FilterableState,
  filterTools,
} from "~/utils/reducerUtils";
import { collator, sortNumber, sortString } from "~/utils/sortTools";

const SHOW_COUNT_DEFAULT = 100;

type ReviewsSort =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc";

export const Actions = {
  FILTER_GENRES: "FILTER_GENRES",
  FILTER_GRADE: "FILTER_GRADE",
  FILTER_RELEASE_YEAR: "FILTER_RELEASE_YEAR",
  FILTER_REVIEW_YEAR: "FILTER_REVIEW_YEAR",
  FILTER_TITLE: "FILTER_TITLE",
  SHOW_MORE: "SHOW_MORE",
  SORT: "SORT",
} as const;

export type ActionType =
  | FilterGenresAction
  | FilterGradeAction
  | FilterReleaseYearAction
  | FilterReviewYearAction
  | FilterTitleAction
  | ShowMoreAction
  | SortAction;

// Define action types
type FilterGenresAction = {
  type: typeof Actions.FILTER_GENRES;
  values: readonly string[];
};

type FilterGradeAction = {
  type: typeof Actions.FILTER_GRADE;
  values: [number, number];
};

type FilterReleaseYearAction = {
  type: typeof Actions.FILTER_RELEASE_YEAR;
  values: [string, string];
};

type FilterReviewYearAction = {
  type: typeof Actions.FILTER_REVIEW_YEAR;
  values: [string, string];
};

type FilterTitleAction = {
  type: typeof Actions.FILTER_TITLE;
  value: string;
};

type ShowMoreAction = {
  type: typeof Actions.SHOW_MORE;
};

type SortAction = {
  type: typeof Actions.SORT;
  value: ReviewsSort;
};

// Define state type
type State = FilterableState<
  ReviewListItemValue,
  ReviewsSort,
  Map<string, ReviewListItemValue[]>
>;

// Helper functions
function getReviewDateGroup(value: ReviewListItemValue): string {
  if (value.reviewMonth) {
    return `${value.reviewMonth} ${value.reviewYear}`;
  }
  return value.reviewYear;
}

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
      return value.releaseYear;
    }
    case "review-date-asc":
    case "review-date-desc": {
      return getReviewDateGroup(value);
    }
    case "title-asc":
    case "title-desc": {
      return getGroupLetter(value.sortTitle);
    }
  }
}

function sortValues(
  values: ReviewListItemValue[],
  sortOrder: ReviewsSort,
): ReviewListItemValue[] {
  const sortMap: Record<
    ReviewsSort,
    (a: ReviewListItemValue, b: ReviewListItemValue) => number
  > = {
    "grade-asc": (a, b) => sortNumber(a.gradeValue ?? 0, b.gradeValue ?? 0),
    "grade-desc": (a, b) =>
      sortNumber(a.gradeValue ?? 0, b.gradeValue ?? 0) * -1,
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

  const comparer = sortMap[sortOrder];
  return values.sort(comparer);
}

// Create groupValues function using buildGroupValues
const groupValues = buildGroupValues(groupForValue);

// Create filterTools helpers
const { updateFilter } = filterTools(sortValues, groupValues);

// Re-export sort type for convenience
export type Sort = ReviewsSort;

// Create initState function
export function initState({
  initialSort,
  values,
}: {
  initialSort: ReviewsSort;
  values: ReviewListItemValue[];
}): State {
  return {
    allValues: values,
    filteredValues: values,
    filters: {},
    groupedValues: groupValues(
      values.slice(0, SHOW_COUNT_DEFAULT),
      initialSort,
    ),
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: initialSort,
  };
}

// Create reducer function
export function reducer(state: State, action: ActionType): State {
  let filteredValues;
  let groupedValues;

  switch (action.type) {
    case Actions.FILTER_GENRES: {
      return updateFilter(state, "genres", (value) => {
        return action.values.every((genre) => value.genres.includes(genre));
      });
    }
    case Actions.FILTER_GRADE: {
      return updateFilter(state, "grade", (value) => {
        return (
          value.gradeValue >= action.values[0] &&
          value.gradeValue <= action.values[1]
        );
      });
    }
    case Actions.FILTER_RELEASE_YEAR: {
      return updateFilter(state, "releaseYear", (value) => {
        const releaseYear = value.releaseYear;
        return (
          releaseYear >= action.values[0] && releaseYear <= action.values[1]
        );
      });
    }
    case Actions.FILTER_REVIEW_YEAR: {
      return updateFilter(state, "reviewYear", (value) => {
        const year = value.reviewSequence.slice(0, 4);

        return year >= action.values[0] && year <= action.values[1];
      });
    }
    case Actions.FILTER_TITLE: {
      const regex = new RegExp(action.value, "i");
      return updateFilter(state, "title", (value) => {
        return regex.test(value.title);
      });
    }
    case Actions.SHOW_MORE: {
      const showCount = state.showCount + SHOW_COUNT_DEFAULT;

      groupedValues = groupValues(
        state.filteredValues.slice(0, showCount),
        state.sortValue,
      );

      return {
        ...state,
        groupedValues,
        showCount,
      };
    }
    case Actions.SORT: {
      filteredValues = sortValues(state.filteredValues, action.value);
      groupedValues = groupValues(
        filteredValues.slice(0, state.showCount),
        action.value,
      );
      return {
        ...state,
        filteredValues,
        groupedValues,
        sortValue: action.value,
      };
    }
  }
}
