import {
  applyPendingFilters,
  buildGroupValues,
  clearPendingFilters,
  createInitialState,
  createReleaseYearFilter,
  createTitleFilter,
  getGroupLetter,
  ListWithFiltersActions,
  type ListWithFiltersState,
  resetPendingFilters,
  showMore,
  sortString,
  updatePendingFilter,
  updateSort,
} from "~/components/ListWithFilters.reducerUtils";

/**
 * Watchlist reducer with pending filters support
 */
import type { ListItemValue } from "./Watchlist";

export type Sort =
  | "release-date-asc"
  | "release-date-desc"
  | "title-asc"
  | "title-desc";

const SHOW_COUNT_DEFAULT = 100;

export enum Actions {
  APPLY_PENDING_FILTERS = ListWithFiltersActions.APPLY_PENDING_FILTERS,
  CLEAR_PENDING_FILTERS = ListWithFiltersActions.CLEAR_PENDING_FILTERS,
  PENDING_FILTER_COLLECTION = "PENDING_FILTER_COLLECTION",
  PENDING_FILTER_DIRECTOR = "PENDING_FILTER_DIRECTOR",
  PENDING_FILTER_PERFORMER = "PENDING_FILTER_PERFORMER",
  PENDING_FILTER_RELEASE_YEAR = "PENDING_FILTER_RELEASE_YEAR",
  PENDING_FILTER_TITLE = "PENDING_FILTER_TITLE",
  PENDING_FILTER_WRITER = "PENDING_FILTER_WRITER",
  RESET_PENDING_FILTERS = ListWithFiltersActions.RESET_PENDING_FILTERS,
  SHOW_MORE = ListWithFiltersActions.SHOW_MORE,
  SORT = ListWithFiltersActions.SORT,
}

export type ActionType =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | PendingFilterCollectionAction
  | PendingFilterDirectorAction
  | PendingFilterPerformerAction
  | PendingFilterReleaseYearAction
  | PendingFilterTitleAction
  | PendingFilterWriterAction
  | ResetPendingFiltersAction
  | ShowMoreAction
  | SortAction;

type ApplyPendingFiltersAction = {
  type: Actions.APPLY_PENDING_FILTERS;
};

type ClearPendingFiltersAction = {
  type: Actions.CLEAR_PENDING_FILTERS;
};

type PendingFilterCollectionAction = {
  type: Actions.PENDING_FILTER_COLLECTION;
  value: string;
};

type PendingFilterDirectorAction = {
  type: Actions.PENDING_FILTER_DIRECTOR;
  value: string;
};

type PendingFilterPerformerAction = {
  type: Actions.PENDING_FILTER_PERFORMER;
  value: string;
};

type PendingFilterReleaseYearAction = {
  type: Actions.PENDING_FILTER_RELEASE_YEAR;
  values: [string, string];
};

type PendingFilterTitleAction = {
  type: Actions.PENDING_FILTER_TITLE;
  value: string;
};

type PendingFilterWriterAction = {
  type: Actions.PENDING_FILTER_WRITER;
  value: string;
};

type ResetPendingFiltersAction = {
  type: Actions.RESET_PENDING_FILTERS;
};

type ShowMoreAction = {
  type: Actions.SHOW_MORE;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type State = ListWithFiltersState<ListItemValue, Sort> & {
  hideReviewed: boolean;
};

// Helper functions
function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "release-date-asc":
    case "release-date-desc": {
      return value.releaseYear;
    }
    case "title-asc":
    case "title-desc": {
      return getGroupLetter(value.sortTitle);
    }
    // no default
  }
}

function sortValues(values: ListItemValue[], sortOrder: Sort): ListItemValue[] {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "release-date-asc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence),
      "release-date-desc": (a, b) =>
        sortString(a.releaseSequence, b.releaseSequence) * -1,
      "title-asc": (a, b) => sortString(a.sortTitle, b.sortTitle),
      "title-desc": (a, b) => sortString(a.sortTitle, b.sortTitle) * -1,
    };

  const comparer = sortMap[sortOrder];
  return [...values].sort(comparer);
}

const groupValues = buildGroupValues(groupForValue);

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  const baseState = createInitialState({
    groupFn: groupValues,
    initialSort,
    showCount: SHOW_COUNT_DEFAULT,
    sortFn: sortValues,
    values,
  });

  return {
    ...baseState,
    hideReviewed: false,
  };
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case Actions.APPLY_PENDING_FILTERS: {
      return {
        ...applyPendingFilters(state, sortValues, groupValues),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.CLEAR_PENDING_FILTERS: {
      return {
        ...clearPendingFilters(state),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.PENDING_FILTER_COLLECTION: {
      const filterFn =
        action.value && action.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistCollectionNames.includes(action.value)
          : undefined;
      return {
        ...updatePendingFilter(state, "collection", filterFn, action.value),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.PENDING_FILTER_DIRECTOR: {
      const filterFn =
        action.value && action.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistDirectorNames.includes(action.value)
          : undefined;
      return {
        ...updatePendingFilter(state, "director", filterFn, action.value),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.PENDING_FILTER_PERFORMER: {
      const filterFn =
        action.value && action.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistPerformerNames.includes(action.value)
          : undefined;
      return {
        ...updatePendingFilter(state, "performer", filterFn, action.value),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.PENDING_FILTER_RELEASE_YEAR: {
      const filterFn = action.values[0]
        ? createReleaseYearFilter(action.values[0], action.values[1])
        : undefined;
      return {
        ...updatePendingFilter(state, "releaseYear", filterFn, action.values),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.PENDING_FILTER_TITLE: {
      const filterFn = action.value
        ? createTitleFilter(action.value)
        : undefined;
      return {
        ...updatePendingFilter(state, "title", filterFn, action.value),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.PENDING_FILTER_WRITER: {
      const filterFn =
        action.value && action.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistWriterNames.includes(action.value)
          : undefined;
      return {
        ...updatePendingFilter(state, "writer", filterFn, action.value),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.RESET_PENDING_FILTERS: {
      return {
        ...resetPendingFilters(state),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.SHOW_MORE: {
      return {
        ...showMore(state, SHOW_COUNT_DEFAULT, groupValues),
        hideReviewed: state.hideReviewed,
      };
    }

    case Actions.SORT: {
      return {
        ...updateSort(state, action.value, sortValues, groupValues),
        hideReviewed: state.hideReviewed,
      };
    }

    // no default
  }
}
