import type { FilterableState } from "~/utils/filterTools";

import { buildGroupValues } from "~/utils/buildGroupValues";
import { filterTools } from "~/utils/filterTools";
import { sortNumber, sortString } from "~/utils/sortTools";

import type { ListItemValue } from "./CastAndCrew";

export enum Actions {
  FILTER_CREDIT_KIND = "FILTER_CREDIT_KIND",
  FILTER_NAME = "FILTER_NAME",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
}

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc"
  | "title-count-asc"
  | "title-count-desc";

const groupValues = buildGroupValues(groupForValue);
const { clearFilter, updateFilter } = filterTools(sortValues, groupValues);

function sortValues(values: ListItemValue[], sortOrder: Sort): ListItemValue[] {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "name-asc": (a, b) => sortString(a.name, b.name),
      "name-desc": (a, b) => sortString(a.name, b.name) * -1,
      "review-count-asc": (a, b) => sortNumber(a.reviewCount, b.reviewCount),
      "review-count-desc": (a, b) =>
        sortNumber(a.reviewCount, b.reviewCount) * -1,
      "title-count-asc": (a, b) => sortNumber(a.totalCount, b.totalCount),
      "title-count-desc": (a, b) => sortNumber(a.totalCount, b.totalCount) * -1,
    };

  const comparer = sortMap[sortOrder];

  return values.sort(comparer);
}

function groupForValue(item: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "name-asc":
    case "name-desc": {
      const letter = item.name.slice(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return item.name.slice(0, 1).toLocaleUpperCase();
    }
    case "review-count-asc":
    case "review-count-desc": {
      return "";
    }
    case "title-count-asc":
    case "title-count-desc": {
      return "";
    }
    // no default
  }
}

type State = FilterableState<ListItemValue, Sort, Map<string, ListItemValue[]>>;

const SHOW_COUNT_DEFAULT = 100;

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

type FilterNameAction = {
  type: Actions.FILTER_NAME;
  value: string;
};

type FilterCreditKindAction = {
  type: Actions.FILTER_CREDIT_KIND;
  value: string;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type ShowMoreAction = {
  type: Actions.SHOW_MORE;
};

export type ActionType =
  | FilterCreditKindAction
  | FilterNameAction
  | ShowMoreAction
  | SortAction;

export function reducer(state: State, action: ActionType): State {
  let groupedValues;
  let filteredValues;

  switch (action.type) {
    case Actions.FILTER_CREDIT_KIND: {
      return (
        clearFilter(action.value, state, "credits") ??
        updateFilter(state, "credits", (value) => {
          return value.creditedAs.includes(action.value);
        })
      );
    }
    case Actions.FILTER_NAME: {
      const regex = new RegExp(action.value, "i");
      return updateFilter(state, "name", (value) => {
        return regex.test(value.name);
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
