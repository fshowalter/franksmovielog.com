import { buildGroupValues } from "src/utils/buildGroupValues";
import { type FilterableState, filterTools } from "src/utils/filterTools";
import { collator, sortNumber, sortString } from "src/utils/sortTools";

import type { ListItemValue } from "./CastAndCrewMember";

export type Sort =
  | "release-date-desc"
  | "release-date-asc"
  | "title"
  | "grade-asc"
  | "grade-desc";

const SHOW_COUNT_DEFAULT = 100;

const groupValues = buildGroupValues(groupForValue);
const { updateFilter, applyFilters, clearFilter } = filterTools(
  sortValues,
  groupValues,
);

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "release-date-desc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence) * -1,
      "release-date-asc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence),
      title: (a, b) => collator.compare(a.sortTitle, b.sortTitle),
      "grade-asc": (a, b) => sortNumber(a.gradeValue ?? 50, b.gradeValue ?? 50),
      "grade-desc": (a, b) =>
        sortNumber(a.gradeValue ?? -1, b.gradeValue ?? -1) * -1,
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
    case "grade-asc":
    case "grade-desc": {
      return value.grade ?? "Unrated";
    }
    case "title": {
      const letter = value.sortTitle.substring(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return value.sortTitle.substring(0, 1).toLocaleUpperCase();
    }
    // no default
  }
}

interface State
  extends FilterableState<ListItemValue, Sort, Map<string, ListItemValue[]>> {
  hideReviewed: boolean;
}

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
    filters: {},
    groupedValues: groupValues(
      values.slice(0, SHOW_COUNT_DEFAULT),
      initialSort,
    ),
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: initialSort,
    hideReviewed: false,
  };
}

export enum Actions {
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_RELEASE_YEAR = "FILTER_RELEASE_YEAR",
  SORT = "SORT",
  SHOW_MORE = "SHOW_MORE",
  TOGGLE_REVIEWED = "TOGGLE_REVIEWED",
  FILTER_CREDIT_KIND = "FILTER_CREDIT_KIND",
}

interface FilterTitleAction {
  type: Actions.FILTER_TITLE;
  value: string;
}

interface FilterCreditKindAction {
  type: Actions.FILTER_CREDIT_KIND;
  value: string;
}

interface FilterReleaseYearAction {
  type: Actions.FILTER_RELEASE_YEAR;
  values: [string, string];
}

interface SortAction {
  type: Actions.SORT;
  value: Sort;
}

interface ShowMoreAction {
  type: Actions.SHOW_MORE;
}

interface ToggleReviewedAction {
  type: Actions.TOGGLE_REVIEWED;
}

export type ActionType =
  | FilterTitleAction
  | FilterReleaseYearAction
  | FilterCreditKindAction
  | SortAction
  | ShowMoreAction
  | ToggleReviewedAction;

/**
 * Applies the given action to the given state, returning a new State object.
 * @param state The current state.
 * @param action The action to apply.
 */
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
    case Actions.FILTER_CREDIT_KIND: {
      return (
        clearFilter(action.value, state, "credits") ??
        updateFilter(state, "credits", (value) => {
          return value.creditedAs.includes(action.value);
        })
      );
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
            return value.slug === null;
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
