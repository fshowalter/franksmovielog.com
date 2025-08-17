import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters.reducerUtils";

import {
  buildGroupValues,
  createInitialState,
  getGroupLetter,
  handleGenreFilterAction,
  handleListWithFiltersAction,
  handleReleaseYearFilterAction,
  handleTitleFilterAction,
  ListWithFiltersActions,
  sortString,
  updatePendingFilter,
} from "~/components/ListWithFilters.reducerUtils";

/**
 * Watchlist reducer with pending filters support
 */
import type { ListItemValue } from "./Watchlist";

enum WatchlistActions {
  PENDING_FILTER_COLLECTION = "PENDING_FILTER_COLLECTION",
  PENDING_FILTER_DIRECTOR = "PENDING_FILTER_DIRECTOR",
  PENDING_FILTER_PERFORMER = "PENDING_FILTER_PERFORMER",
  PENDING_FILTER_WRITER = "PENDING_FILTER_WRITER",
}

export type Sort =
  | "release-date-asc"
  | "release-date-desc"
  | "title-asc"
  | "title-desc";

// Re-export shared actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...WatchlistActions,
} as const;

export type ActionType =
  | ListWithFiltersActionType<Sort>
  | PendingFilterCollectionAction
  | PendingFilterDirectorAction
  | PendingFilterPerformerAction
  | PendingFilterWriterAction;

// Watchlist-specific filter actions
type PendingFilterCollectionAction = {
  type: WatchlistActions.PENDING_FILTER_COLLECTION;
  value: string;
};

type PendingFilterDirectorAction = {
  type: WatchlistActions.PENDING_FILTER_DIRECTOR;
  value: string;
};

type PendingFilterPerformerAction = {
  type: WatchlistActions.PENDING_FILTER_PERFORMER;
  value: string;
};

type PendingFilterWriterAction = {
  type: WatchlistActions.PENDING_FILTER_WRITER;
  value: string;
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
    // Field-specific shared filters
    case ListWithFiltersActions.PENDING_FILTER_GENRES: {
      return handleGenreFilterAction(state, action, {
        hideReviewed: state.hideReviewed,
      });
    }

    case ListWithFiltersActions.PENDING_FILTER_RELEASE_YEAR: {
      return handleReleaseYearFilterAction(state, action, {
        hideReviewed: state.hideReviewed,
      });
    }

    case ListWithFiltersActions.PENDING_FILTER_TITLE: {
      return handleTitleFilterAction(state, action, {
        hideReviewed: state.hideReviewed,
      });
    }

    case WatchlistActions.PENDING_FILTER_COLLECTION: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistCollectionNames.includes(typedAction.value)
          : undefined;
      return {
        ...updatePendingFilter(
          state,
          "collection",
          filterFn,
          typedAction.value,
        ),
        hideReviewed: state.hideReviewed,
      };
    }

    case WatchlistActions.PENDING_FILTER_DIRECTOR: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistDirectorNames.includes(typedAction.value)
          : undefined;
      return {
        ...updatePendingFilter(state, "director", filterFn, typedAction.value),
        hideReviewed: state.hideReviewed,
      };
    }

    case WatchlistActions.PENDING_FILTER_PERFORMER: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistPerformerNames.includes(typedAction.value)
          : undefined;
      return {
        ...updatePendingFilter(state, "performer", filterFn, typedAction.value),
        hideReviewed: state.hideReviewed,
      };
    }

    case WatchlistActions.PENDING_FILTER_WRITER: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistWriterNames.includes(typedAction.value)
          : undefined;
      return {
        ...updatePendingFilter(state, "writer", filterFn, typedAction.value),
        hideReviewed: state.hideReviewed,
      };
    }

    default: {
      // Handle shared list structure actions
      return handleListWithFiltersAction(
        state,
        action,
        { groupFn: groupValues, sortFn: sortValues },
        { hideReviewed: state.hideReviewed },
      );
    }
  }
}
