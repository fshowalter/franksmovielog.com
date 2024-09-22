import { buildGroupValues } from "src/utils/buildGroupValues";
import { type FilterableState, filterTools } from "src/utils/filterTools";
import { collator, sortString } from "src/utils/sortTools";

import type { ListItemValue } from "./Watchlist";

export type Sort = "release-date-desc" | "release-date-asc" | "title";

const SHOW_COUNT_DEFAULT = 100;

const groupValues = buildGroupValues(groupForValue);
const { updateFilter, applyFilters } = filterTools(sortValues, groupValues);

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "release-date-desc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence) * -1,
      "release-date-asc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence),
      title: (a, b) => collator.compare(a.sortTitle, b.sortTitle),
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
  FILTER_DIRECTOR = "FILTER_DIRECTOR",
  FILTER_PERFORMER = "FILTER_PERFORMER",
  FILTER_WRITER = "FILTER_WRITER",
  FILTER_COLLECTION = "FILTER_COLLECTION",
  SORT = "SORT",
  SHOW_MORE = "SHOW_MORE",
}

interface FilterTitleAction {
  type: Actions.FILTER_TITLE;
  value: string;
}

interface FilterCollectionAction {
  type: Actions.FILTER_COLLECTION;
  value: string;
}

interface FilterDirectorAction {
  type: Actions.FILTER_DIRECTOR;
  value: string;
}

interface FilterPerformerAction {
  type: Actions.FILTER_PERFORMER;
  value: string;
}

interface FilterWriterAction {
  type: Actions.FILTER_WRITER;
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

export type ActionType =
  | FilterTitleAction
  | FilterDirectorAction
  | FilterPerformerAction
  | FilterWriterAction
  | FilterCollectionAction
  | FilterReleaseYearAction
  | SortAction
  | ShowMoreAction;

function clearFilter(
  value: string,
  currentState: State,
  key: string,
): State | null {
  if (value != "All") {
    return null;
  }

  const filters = {
    ...currentState.filters,
  };

  delete filters[key];

  return applyFilters(filters, currentState);
}

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
    case Actions.FILTER_DIRECTOR: {
      return (
        clearFilter(action.value, state, "director") ??
        updateFilter(state, "director", (value) => {
          return value.directorNames.includes(action.value);
        })
      );
    }
    case Actions.FILTER_PERFORMER: {
      return (
        clearFilter(action.value, state, "performer") ??
        updateFilter(state, "performer", (value) => {
          return value.performerNames.includes(action.value);
        })
      );
    }
    case Actions.FILTER_WRITER: {
      return (
        clearFilter(action.value, state, "writer") ??
        updateFilter(state, "writer", (value) => {
          return value.writerNames.includes(action.value);
        })
      );
    }
    case Actions.FILTER_COLLECTION: {
      return (
        clearFilter(action.value, state, "collection") ??
        updateFilter(state, "collection", (value) => {
          return value.collectionNames.includes(action.value);
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
