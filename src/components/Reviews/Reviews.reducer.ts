import { buildGroupValues } from "src/utils/buildGroupValues";
import { type FilterableState, filterTools } from "src/utils/filterTools";
import { collator, sortNumber, sortString } from "src/utils/sortTools";

import type { ListItemValue } from "./Reviews";

const SHOW_COUNT_DEFAULT = 100;

export type Sort =
  | "release-date-desc"
  | "release-date-asc"
  | "review-date-desc"
  | "review-date-asc"
  | "title-asc"
  | "title-desc"
  | "grade-asc"
  | "grade-desc";

const groupValues = buildGroupValues(groupForValue);
const { updateFilter } = filterTools(sortValues, groupValues);

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "release-date-desc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence) * -1,
      "release-date-asc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence),
      "review-date-desc": (a, b) => sortString(a.reviewDate, b.reviewDate) * -1,
      "review-date-asc": (a, b) => sortString(a.reviewDate, b.reviewDate),
      "title-asc": (a, b) => collator.compare(a.sortTitle, b.sortTitle),
      "title-desc": (a, b) => collator.compare(a.sortTitle, b.sortTitle) * -1,
      "grade-asc": (a, b) => sortNumber(a.gradeValue, b.gradeValue),
      "grade-desc": (a, b) => sortNumber(a.gradeValue, b.gradeValue) * -1,
    };

  const comparer = sortMap[sortOrder];
  return values.sort(comparer);
}

function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "release-date-asc":
    case "release-date-desc": {
      return value.year;
    }
    case "review-date-asc":
    case "review-date-desc": {
      return `${value.reviewMonth} ${value.reviewYear}`;
    }
    case "grade-asc":
    case "grade-desc": {
      return value.grade;
    }
    case "title-asc":
    case "title-desc": {
      const letter = value.sortTitle.substring(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return value.sortTitle.substring(0, 1).toLocaleUpperCase();
    }
    // no default
  }
}

type State = FilterableState<
  ListItemValue,
  Sort,
  Map<string, ListItemValue[]>
> & { showFilters: boolean };

export function initState({
  values,
  initialSort,
}: {
  values: ListItemValue[];
  initialSort: Sort;
}): State {
  return {
    allValues: values,
    filteredValues: values,
    groupedValues: groupValues(
      values.slice(0, SHOW_COUNT_DEFAULT),
      initialSort,
    ),
    filters: {},
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: initialSort,
    showFilters: false,
  };
}

export enum Actions {
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_GRADE = "FILTER_GRADE",
  FILTER_GENRES = "FILTER_GENRES",
  FILTER_REVIEW_YEAR = "FILTER_REVIEW_YEAR",
  FILTER_RELEASE_YEAR = "FILTER_RELEASE_YEAR",
  SORT = "SORT",
  SHOW_MORE = "SHOW_MORE",
}

interface FilterTitleAction {
  type: Actions.FILTER_TITLE;
  value: string;
}

interface FilterGenresAction {
  type: Actions.FILTER_GENRES;
  values: string[];
}

interface FilterGradeAction {
  type: Actions.FILTER_GRADE;
  values: [number, number];
}

interface FilterReleaseYearAction {
  type: Actions.FILTER_RELEASE_YEAR;
  values: [string, string];
}

interface FilterReviewYearAction {
  type: Actions.FILTER_REVIEW_YEAR;
  values: [string, string];
}

interface SortAction {
  type: Actions.SORT;
  value: Sort;
}

interface ShowMoreAction {
  type: Actions.SHOW_MORE;
}

export type ActionType =
  | FilterTitleAction
  | FilterReleaseYearAction
  | FilterReviewYearAction
  | FilterGradeAction
  | FilterGenresAction
  | SortAction
  | ShowMoreAction;

export function reducer(state: State, action: ActionType): State {
  let filteredValues;
  let groupedValues;

  switch (action.type) {
    case Actions.FILTER_TITLE: {
      const regex = new RegExp(action.value, "i");
      return updateFilter(state, "title", (value) => {
        return regex.test(value.title);
      });
    }
    case Actions.FILTER_RELEASE_YEAR: {
      return updateFilter(state, "releaseYear", (value) => {
        const releaseYear = value.year;
        return (
          releaseYear >= action.values[0] && releaseYear <= action.values[1]
        );
      });
    }
    case Actions.FILTER_GENRES: {
      return updateFilter(state, "genres", (value) => {
        return action.values.every((genre) => value.genres.includes(genre));
      });
    }
    case Actions.FILTER_REVIEW_YEAR: {
      return updateFilter(state, "reviewYear", (value) => {
        const reviewYear = value.reviewYear;
        return reviewYear >= action.values[0] && reviewYear <= action.values[1];
      });
    }
    case Actions.FILTER_GRADE: {
      return updateFilter(state, "grade", (value) => {
        const gradeValue = value.gradeValue;
        return gradeValue >= action.values[0] && gradeValue <= action.values[1];
      });
    }
    case Actions.SORT: {
      filteredValues = sortValues(state.filteredValues, action.value);
      groupedValues = groupValues(
        filteredValues.slice(0, state.showCount),
        action.value,
      );
      return {
        ...state,
        sortValue: action.value,
        filteredValues,
        groupedValues,
      };
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

    // no default
  }
}
