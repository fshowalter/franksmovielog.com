import { buildGroupValues } from "src/utils/buildGroupValues";
import type { FilterableState } from "src/utils/filterTools";
import { filterTools } from "src/utils/filterTools";
import { sortNumber, sortString } from "src/utils/sortTools";

import type { ListItemValue } from "./CastAndCrew";

export enum Actions {
  FILTER_NAME = "FILTER_NAME",
  FILTER_CREDIT_KIND = "FILTER_CREDIT_KIND",
  SORT = "SORT",
  SHOW_MORE = "SHOW_MORE",
}

export type Sort =
  | "name-asc"
  | "name-desc"
  | "title-count-asc"
  | "title-count-desc"
  | "review-count-asc"
  | "review-count-desc";

const groupValues = buildGroupValues(groupForValue);
const { updateFilter, clearFilter } = filterTools(sortValues, groupValues);

function sortValues(values: ListItemValue[], sortOrder: Sort): ListItemValue[] {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "name-asc": (a, b) => sortString(a.name, b.name),
      "name-desc": (a, b) => sortString(a.name, b.name) * -1,
      "title-count-asc": (a, b) => sortNumber(a.totalCount, b.totalCount),
      "title-count-desc": (a, b) => sortNumber(a.totalCount, b.totalCount) * -1,
      "review-count-asc": (a, b) => sortNumber(a.reviewCount, b.reviewCount),
      "review-count-desc": (a, b) =>
        sortNumber(a.reviewCount, b.reviewCount) * -1,
    };

  const comparer = sortMap[sortOrder];

  return values.sort(comparer);
}

function groupForValue(item: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "name-asc":
    case "name-desc": {
      const letter = item.name.substring(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return item.name.substring(0, 1).toLocaleUpperCase();
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
  };
}

interface FilterNameAction {
  type: Actions.FILTER_NAME;
  value: string;
}

interface FilterCreditKindAction {
  type: Actions.FILTER_CREDIT_KIND;
  value: string;
}

interface SortAction {
  type: Actions.SORT;
  value: Sort;
}

interface ShowMoreAction {
  type: Actions.SHOW_MORE;
}

export type ActionType =
  | FilterNameAction
  | FilterCreditKindAction
  | SortAction
  | ShowMoreAction;

export function reducer(state: State, action: ActionType): State {
  let groupedValues;
  let filteredValues;

  switch (action.type) {
    case Actions.FILTER_NAME: {
      const regex = new RegExp(action.value, "i");
      return updateFilter(state, "name", (value) => {
        return regex.test(value.name);
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
        sortValue: action.value,
        filteredValues,
        groupedValues,
      };
    }

    // no default
  }
}
