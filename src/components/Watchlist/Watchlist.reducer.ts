import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import type {
  TitleFilterValues,
  TitlesActionType,
  TitleSortType,
} from "~/components/ListWithFilters/titlesReducerUtils";

import {
  createInitialState,
  handleListWithFiltersAction,
  ListWithFiltersActions,
  updatePendingFilter,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  createPaginatedGroupFn,
  createTitleGroupForValue,
  handleGenreFilterAction,
  handleReleaseYearFilterAction,
  handleShowMore,
  handleTitleFilterAction,
  SHOW_COUNT_DEFAULT,
  sortReleaseDate,
  sortTitle,
  TitlesActions,
} from "~/components/ListWithFilters/titlesReducerUtils";
import {
  buildGroupValues,
  buildSortValues,
} from "~/components/utils/reducerUtils";

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

export type Sort = Extract<
  TitleSortType,
  "release-date-asc" | "release-date-desc" | "title-asc" | "title-desc"
>;

export type WatchlistFilterValues = Pick<
  TitleFilterValues,
  "genre" | "releaseYear" | "title"
> & {
  collection?: string;
  director?: string;
  performer?: string;
  writer?: string;
};

// Re-export actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...TitlesActions,
  ...WatchlistActions,
} as const;

export type ActionType =
  | Extract<
      TitlesActionType<Sort>,
      | ListWithFiltersActionType<Sort>
      | { type: TitlesActions.PENDING_FILTER_GENRES }
      | { type: TitlesActions.PENDING_FILTER_RELEASE_YEAR }
      | { type: TitlesActions.PENDING_FILTER_TITLE }
      | { type: TitlesActions.SHOW_MORE }
    >
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
  showCount: number;
};

const groupForValue = createTitleGroupForValue<ListItemValue, Sort>();

const sortValues = buildSortValues<ListItemValue, Sort>({
  ...sortReleaseDate<ListItemValue>(),
  ...sortTitle<ListItemValue>(),
});

const groupValues = buildGroupValues(groupForValue);

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  const showCount = SHOW_COUNT_DEFAULT;
  const baseState = createInitialState({
    extendedState: {
      showCount,
    },
    groupFn: groupValues,
    initialSort,
    showCount,
    sortFn: sortValues,
    values,
  });

  return baseState;
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    // Field-specific shared filters
    case TitlesActions.PENDING_FILTER_GENRES: {
      return handleGenreFilterAction(state, action, {
        showCount: state.showCount,
      });
    }

    case TitlesActions.PENDING_FILTER_RELEASE_YEAR: {
      return handleReleaseYearFilterAction(state, action, {
        showCount: state.showCount,
      });
    }

    case TitlesActions.PENDING_FILTER_TITLE: {
      return handleTitleFilterAction(state, action, {
        showCount: state.showCount,
      });
    }

    case TitlesActions.SHOW_MORE: {
      return handleShowMore(state, action, groupValues);
    }

    case WatchlistActions.PENDING_FILTER_COLLECTION: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistCollectionNames.includes(typedAction.value)
          : undefined;

      const filterKey: keyof WatchlistFilterValues = "collection";
      return {
        ...updatePendingFilter(state, filterKey, filterFn, typedAction.value),
        showCount: state.showCount,
      };
    }
    case WatchlistActions.PENDING_FILTER_DIRECTOR: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistDirectorNames.includes(typedAction.value)
          : undefined;
      const filterKey: keyof WatchlistFilterValues = "director";
      return {
        ...updatePendingFilter(state, filterKey, filterFn, typedAction.value),
        showCount: state.showCount,
      };
    }
    case WatchlistActions.PENDING_FILTER_PERFORMER: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistPerformerNames.includes(typedAction.value)
          : undefined;
      const filterKey: keyof WatchlistFilterValues = "performer";
      return {
        ...updatePendingFilter(state, filterKey, filterFn, typedAction.value),
        showCount: state.showCount,
      };
    }
    case WatchlistActions.PENDING_FILTER_WRITER: {
      const typedAction = action;
      const filterFn =
        typedAction.value && typedAction.value !== "All"
          ? (value: ListItemValue) =>
              value.watchlistWriterNames.includes(typedAction.value)
          : undefined;
      const filterKey: keyof WatchlistFilterValues = "writer";
      return {
        ...updatePendingFilter(state, filterKey, filterFn, typedAction.value),
        showCount: state.showCount,
      };
    }

    default: {
      // Handle shared list structure actions
      const paginatedGroupFn = createPaginatedGroupFn(
        groupValues,
        state.showCount,
      );
      return handleListWithFiltersAction(
        state,
        action,
        { groupFn: paginatedGroupFn, sortFn: sortValues },
        { showCount: state.showCount },
      );
    }
  }
}
