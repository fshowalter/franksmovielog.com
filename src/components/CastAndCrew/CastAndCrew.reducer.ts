import type { FilterableState } from "~/utils/filterTools";

import { buildGroupValues } from "~/utils/buildGroupValues";
import { filterTools } from "~/utils/filterTools";
import { sortNumber, sortString } from "~/utils/sortTools";

import type { ListItemValue } from "./CastAndCrew";

export enum Actions {
  FILTER_CREDIT_KIND = "FILTER_CREDIT_KIND",
  FILTER_NAME = "FILTER_NAME",
  SORT = "SORT",
}

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

const groupValues = buildGroupValues(groupForValue);
const { clearFilter, updateFilter } = filterTools(sortValues, groupValues);

type State = FilterableState<ListItemValue, Sort, Map<string, ListItemValue[]>>;

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
    // no default
  }
}

function sortValues(values: ListItemValue[], sortOrder: Sort): ListItemValue[] {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "name-asc": (a, b) => sortString(a.name, b.name),
      "name-desc": (a, b) => sortString(a.name, b.name) * -1,
      "review-count-asc": (a, b) => sortNumber(a.reviewCount, b.reviewCount),
      "review-count-desc": (a, b) =>
        sortNumber(a.reviewCount, b.reviewCount) * -1,
    };

  const comparer = sortMap[sortOrder];

  return values.sort(comparer);
}

const SHOW_COUNT_DEFAULT = 100;

export type ActionType = FilterCreditKindAction | FilterNameAction | SortAction;

type FilterCreditKindAction = {
  type: Actions.FILTER_CREDIT_KIND;
  value: string;
};

type FilterNameAction = {
  type: Actions.FILTER_NAME;
  value: string;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
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
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: initialSort,
  };
}

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
