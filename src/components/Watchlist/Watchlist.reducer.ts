import { buildGroupValues } from "~/utils/buildGroupValues";
import { type FilterableState, filterTools } from "~/utils/filterTools";
import { collator, sortString } from "~/utils/sortTools";

import type { ListItemValue } from "./Watchlist";

export type Sort = "release-date-asc" | "release-date-desc" | "title";

const SHOW_COUNT_DEFAULT = 100;

const groupValues = buildGroupValues(groupForValue);
const { applyFilters, updateFilter } = filterTools(sortValues, groupValues);

export enum Actions {
  FILTER_COLLECTION = "FILTER_COLLECTION",
  FILTER_DIRECTOR = "FILTER_DIRECTOR",
  FILTER_PERFORMER = "FILTER_PERFORMER",
  FILTER_RELEASE_YEAR = "FILTER_RELEASE_YEAR",
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_WRITER = "FILTER_WRITER",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
}

export type ActionType =
  | FilterCollectionAction
  | FilterDirectorAction
  | FilterPerformerAction
  | FilterReleaseYearAction
  | FilterTitleAction
  | FilterWriterAction
  | ShowMoreAction
  | SortAction;

type FilterCollectionAction = {
  type: Actions.FILTER_COLLECTION;
  value: string;
};

type FilterDirectorAction = {
  type: Actions.FILTER_DIRECTOR;
  value: string;
};

type FilterPerformerAction = {
  type: Actions.FILTER_PERFORMER;
  value: string;
};

type FilterReleaseYearAction = {
  type: Actions.FILTER_RELEASE_YEAR;
  values: [string, string];
};

type FilterTitleAction = {
  type: Actions.FILTER_TITLE;
  value: string;
};

type FilterWriterAction = {
  type: Actions.FILTER_WRITER;
  value: string;
};

type ShowMoreAction = {
  type: Actions.SHOW_MORE;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

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

export function reducer(state: State, action: ActionType): State {
  let filteredValues;
  let groupedValues;

  switch (action.type) {
    case Actions.FILTER_COLLECTION: {
      return (
        clearFilter(action.value, state, "collection") ??
        updateFilter(state, "collection", (value) => {
          return value.collectionNames.includes(action.value);
        })
      );
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
    case Actions.FILTER_RELEASE_YEAR: {
      return updateFilter(state, "releaseYear", (value) => {
        const releaseYear = value.year;
        return (
          releaseYear >= action.values[0] && releaseYear <= action.values[1]
        );
      });
    }
    case Actions.FILTER_TITLE: {
      const regex = new RegExp(action.value, "i");
      return updateFilter(state, "title", (value) => {
        return regex.test(value.title);
      });
    }
    case Actions.FILTER_WRITER: {
      return (
        clearFilter(action.value, state, "writer") ??
        updateFilter(state, "writer", (value) => {
          return value.writerNames.includes(action.value);
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
        filteredValues,
        groupedValues,
        sortValue: action.value,
      };
    }

    // no default
  }
}

function clearFilter(
  value: string,
  currentState: State,
  key: string,
): State | undefined {
  if (value != "All") {
    return undefined;
  }

  const filters = {
    ...currentState.filters,
  };

  delete filters[key];

  return applyFilters(filters, currentState);
}

function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "release-date-asc":
    case "release-date-desc": {
      return value.year;
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
      "release-date-asc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence),
      "release-date-desc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence) * -1,
      title: (a, b) => collator.compare(a.sortTitle, b.sortTitle),
    };

  const comparer = sortMap[sortOrder];
  return values.sort(comparer);
}
