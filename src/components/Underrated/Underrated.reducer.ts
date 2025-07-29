import { buildGroupValues } from "~/utils/buildGroupValues";
import { type FilterableState, filterTools } from "~/utils/filterTools";
import { collator, sortNumber, sortString } from "~/utils/sortTools";

import type { ListItemValue } from "./Underrated";

const SHOW_COUNT_DEFAULT = 100;

export type Sort =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc";

const groupValues = buildGroupValues(groupForValue);
const { updateFilter } = filterTools(sortValues, groupValues);

export enum Actions {
  FILTER_GENRES = "FILTER_GENRES",
  FILTER_RELEASE_YEAR = "FILTER_RELEASE_YEAR",
  FILTER_REVIEW_YEAR = "FILTER_REVIEW_YEAR",
  FILTER_TITLE = "FILTER_TITLE",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
}

export type ActionType =
  | FilterGenresAction
  | FilterReleaseYearAction
  | FilterReviewYearAction
  | FilterTitleAction
  | ShowMoreAction
  | SortAction;

type FilterGenresAction = {
  type: Actions.FILTER_GENRES;
  values: string[];
};

type FilterReleaseYearAction = {
  type: Actions.FILTER_RELEASE_YEAR;
  values: [string, string];
};

type FilterReviewYearAction = {
  type: Actions.FILTER_REVIEW_YEAR;
  values: [string, string];
};

type FilterTitleAction = {
  type: Actions.FILTER_TITLE;
  value: string;
};

type ShowMoreAction = {
  type: Actions.SHOW_MORE;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type State = FilterableState<ListItemValue, Sort, Map<string, ListItemValue[]>>;

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
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

export function reducer(state: State, action: ActionType): State {
  let filteredValues;
  let groupedValues;

  switch (action.type) {
    case Actions.FILTER_GENRES: {
      return updateFilter(state, "genres", (value) => {
        return action.values.every((genre) => value.genres.includes(genre));
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
    case Actions.FILTER_REVIEW_YEAR: {
      return updateFilter(state, "reviewYear", (value) => {
        const reviewYear = value.reviewYear;
        return reviewYear >= action.values[0] && reviewYear <= action.values[1];
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

    // no default
  }
}

function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "grade-asc":
    case "grade-desc": {
      return value.grade;
    }
    case "release-date-asc":
    case "release-date-desc": {
      return value.year.toString();
    }
    case "review-date-asc":
    case "review-date-desc": {
      return value.reviewYear.toString();
    }
    case "title-asc":
    case "title-desc": {
      const letter = value.sortTitle.slice(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return value.sortTitle.slice(0, 1).toLocaleUpperCase();
    }
    // no default
  }
}

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "grade-asc": (a, b) => sortNumber(a.gradeValue, b.gradeValue),
      "grade-desc": (a, b) => sortNumber(a.gradeValue, b.gradeValue) * -1,
      "release-date-asc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence),
      "release-date-desc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence) * -1,
      "review-date-asc": (a, b) =>
        sortString(a.reviewSequence, b.reviewSequence),
      "review-date-desc": (a, b) =>
        sortString(a.reviewSequence, b.reviewSequence) * -1,
      "title-asc": (a, b) => collator.compare(a.sortTitle, b.sortTitle),
      "title-desc": (a, b) => collator.compare(a.sortTitle, b.sortTitle) * -1,
    };

  const comparer = sortMap[sortOrder];
  return values.sort(comparer);
}
