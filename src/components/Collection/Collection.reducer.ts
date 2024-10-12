import { buildGroupValues } from "~/utils/buildGroupValues";
import { type FilterableState, filterTools } from "~/utils/filterTools";
import { collator, sortNumber, sortString } from "~/utils/sortTools";

import type { ListItemValue } from "./Collection";

export type Sort =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "title";

const SHOW_COUNT_DEFAULT = 100;

const groupValues = buildGroupValues(groupForValue);
const { applyFilters, updateFilter } = filterTools(sortValues, groupValues);

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "grade-asc": (a, b) => sortNumber(a.gradeValue ?? 50, b.gradeValue ?? 50),
      "grade-desc": (a, b) =>
        sortNumber(a.gradeValue ?? -1, b.gradeValue ?? -1) * -1,
      "release-date-asc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence),
      "release-date-desc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence) * -1,
      title: (a, b) => collator.compare(a.sortTitle, b.sortTitle),
    };

  const comparer = sortMap[sortOrder];
  return values.sort(comparer);
}

function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "release-date-asc":
    case "release-date-desc": {
      return value.year.toString();
    }
    case "grade-asc":
    case "grade-desc": {
      return value.grade ?? "Unrated";
    }
    case "title": {
      const letter = value.sortTitle.slice(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return value.sortTitle.slice(0, 1).toLocaleUpperCase();
    }
    // no default
  }
}

type State = {
  hideReviewed: boolean;
} & FilterableState<ListItemValue, Sort, Map<string, ListItemValue[]>>;

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
    hideReviewed: false,
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: initialSort,
  };
}

export enum Actions {
  FILTER_RELEASE_YEAR = "FILTER_RELEASE_YEAR",
  FILTER_TITLE = "FILTER_TITLE",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
  TOGGLE_REVIEWED = "TOGGLE_REVIEWED",
}

type FilterTitleAction = {
  type: Actions.FILTER_TITLE;
  value: string;
};

type FilterReleaseYearAction = {
  type: Actions.FILTER_RELEASE_YEAR;
  values: [string, string];
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type ShowMoreAction = {
  type: Actions.SHOW_MORE;
};

type ToggleReviewedAction = {
  type: Actions.TOGGLE_REVIEWED;
};

export type ActionType =
  | FilterReleaseYearAction
  | FilterTitleAction
  | ShowMoreAction
  | SortAction
  | ToggleReviewedAction;

export function reducer(state: State, action: ActionType): State {
  let filteredValues;
  let groupedValues;
  let filters;

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
    case Actions.TOGGLE_REVIEWED: {
      if (state.hideReviewed) {
        filters = {
          ...state.filters,
        };
        delete filters.reviewed;
      } else {
        filters = {
          ...state.filters,
          reviewed: (value: ListItemValue) => {
            return !value.slug;
          },
        };
      }
      return {
        ...applyFilters(filters, state),
        hideReviewed: !state.hideReviewed,
      };
    }
    // no default
  }
}
