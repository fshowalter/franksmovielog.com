import { buildGroupValues } from "~/utils/buildGroupValues";
import { type FilterableState, filterTools } from "~/utils/filterTools";
import { collator, sortNumber, sortString } from "~/utils/sortTools";

import type { ListItemValue } from "./CastAndCrewMember";

export type Sort =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title";

const SHOW_COUNT_DEFAULT = 100;

const groupValues = buildGroupValues(groupForValue);
const { applyFilters, clearFilter, updateFilter } = filterTools(
  sortValues,
  groupValues,
);

export enum Actions {
  FILTER_CREDIT_KIND = "FILTER_CREDIT_KIND",
  FILTER_RELEASE_YEAR = "FILTER_RELEASE_YEAR",
  FILTER_REVIEW_YEAR = "FILTER_REVIEW_YEAR",
  FILTER_TITLE = "FILTER_TITLE",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
  TOGGLE_REVIEWED = "TOGGLE_REVIEWED",
}

export type ActionType =
  | FilterCreditKindAction
  | FilterReleaseYearAction
  | FilterReviewYearAction
  | FilterTitleAction
  | ShowMoreAction
  | SortAction
  | ToggleReviewedAction;

type FilterCreditKindAction = {
  type: Actions.FILTER_CREDIT_KIND;
  value: string;
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

type State = FilterableState<
  ListItemValue,
  Sort,
  Map<string, ListItemValue[]>
> & {
  hideReviewed: boolean;
};

type ToggleReviewedAction = {
  type: Actions.TOGGLE_REVIEWED;
};

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
    case Actions.FILTER_CREDIT_KIND: {
      return (
        clearFilter(action.value, state, "credits") ??
        updateFilter(state, "credits", (value) => {
          return value.creditedAs.includes(action.value);
        })
      );
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
      return updateFilter(state, "releaseYear", (value) => {
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

function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "grade-asc":
    case "grade-desc": {
      return value.grade ?? "Unrated";
    }
    case "release-date-asc":
    case "release-date-desc": {
      return value.year;
    }
    case "review-date-asc":
    case "review-date-desc": {
      return value.reviewYear;
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
      "review-date-asc": (a, b) =>
        sortString(a.reviewSequence ?? "9999", b.reviewSequence ?? "9999"),
      "review-date-desc": (a, b) =>
        sortString(a.reviewSequence ?? "0", b.reviewSequence ?? "0") * -1,
      title: (a, b) => collator.compare(a.sortTitle, b.sortTitle),
    };

  const comparer = sortMap[sortOrder];
  return values.sort(comparer);
}
