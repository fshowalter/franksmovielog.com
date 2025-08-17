import {
  clearPendingFilters as baseClearPendingFilters,
  applyPendingFilters as basePendingFilters,
  resetPendingFilters as baseResetPendingFilters,
  updateSort as baseUpdateSort,
  buildGroupValues,
  createInitialState,
  handlePendingFilterTitle,
  ListWithFiltersActions,
  type ListWithFiltersState,
  updatePendingFilter,
} from "~/components/ListWithFilters.reducerUtils";

import type { ListItemValue } from "./Viewings";

export enum Actions {
  APPLY_PENDING_FILTERS = ListWithFiltersActions.APPLY_PENDING_FILTERS,
  CLEAR_PENDING_FILTERS = ListWithFiltersActions.CLEAR_PENDING_FILTERS,
  NEXT_MONTH = "NEXT_MONTH",
  PENDING_FILTER_MEDIUM = "PENDING_FILTER_MEDIUM",
  PENDING_FILTER_RELEASE_YEAR = "PENDING_FILTER_RELEASE_YEAR",
  PENDING_FILTER_TITLE = "PENDING_FILTER_TITLE",
  PENDING_FILTER_VENUE = "PENDING_FILTER_VENUE",
  PENDING_FILTER_VIEWING_YEAR = "PENDING_FILTER_VIEWING_YEAR",
  PREV_MONTH = "PREV_MONTH",
  RESET_PENDING_FILTERS = ListWithFiltersActions.RESET_PENDING_FILTERS,
  SORT = ListWithFiltersActions.SORT,
}

export type ActionType =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | NextMonthAction
  | PendingFilterMediumAction
  | PendingFilterReleaseYearAction
  | PendingFilterTitleAction
  | PendingFilterVenueAction
  | PendingFilterViewingYearAction
  | PrevMonthAction
  | ResetPendingFiltersAction
  | SortAction;

export type Sort = "viewing-date-asc" | "viewing-date-desc";

type ApplyPendingFiltersAction = {
  type: Actions.APPLY_PENDING_FILTERS;
};

type ClearPendingFiltersAction = {
  type: Actions.CLEAR_PENDING_FILTERS;
};

type NextMonthAction = {
  type: Actions.NEXT_MONTH;
};

type PendingFilterMediumAction = {
  type: Actions.PENDING_FILTER_MEDIUM;
  values: string[];
};

type PendingFilterReleaseYearAction = {
  type: Actions.PENDING_FILTER_RELEASE_YEAR;
  values: string[];
};

type PendingFilterTitleAction = {
  type: Actions.PENDING_FILTER_TITLE;
  value: string;
};

type PendingFilterVenueAction = {
  type: Actions.PENDING_FILTER_VENUE;
  values: string[];
};

type PendingFilterViewingYearAction = {
  type: Actions.PENDING_FILTER_VIEWING_YEAR;
  values: string[];
};

type PrevMonthAction = {
  type: Actions.PREV_MONTH;
};

type ResetPendingFiltersAction = {
  type: Actions.RESET_PENDING_FILTERS;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

// AIDEV-NOTE: Viewings state extends ListWithFiltersState with month navigation
type State = ListWithFiltersState<ListItemValue, Sort> & {
  currentMonth: Date;
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
  monthViewings: ListItemValue[];
};

// AIDEV-NOTE: Viewings don't use grouping, so we use a simple no-op group function
const groupValues = buildGroupValues<ListItemValue, Sort>(() => "all");

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
    showCount: Number.MAX_SAFE_INTEGER, // Viewings don't paginate
    sortFn: sortValues,
    values,
  });

  const currentMonth = getInitialMonth(baseState.filteredValues, initialSort);
  const monthViewings = getMonthViewings(
    baseState.filteredValues,
    currentMonth,
  );

  return {
    ...baseState,
    currentMonth,
    hasNextMonth:
      getNextMonthWithViewings(currentMonth, baseState.filteredValues) !==
      undefined,
    hasPrevMonth:
      getPrevMonthWithViewings(currentMonth, baseState.filteredValues) !==
      undefined,
    monthViewings,
  };
}

export function reducer(state: State, action: ActionType): State {
  let newMonth;

  switch (action.type) {
    case Actions.APPLY_PENDING_FILTERS: {
      return applyPendingFilters(state);
    }

    case Actions.CLEAR_PENDING_FILTERS: {
      return clearPendingFilters(state);
    }
    case Actions.NEXT_MONTH: {
      newMonth = getNextMonthWithViewings(
        state.currentMonth,
        state.filteredValues,
      );
      if (!newMonth) {
        return state; // No next month with viewings
      }
      return {
        ...state,
        currentMonth: newMonth,
        hasNextMonth:
          getNextMonthWithViewings(newMonth, state.filteredValues) !==
          undefined,
        hasPrevMonth:
          getPrevMonthWithViewings(newMonth, state.filteredValues) !==
          undefined,
        monthViewings: getMonthViewings(state.filteredValues, newMonth),
      };
    }

    case Actions.PENDING_FILTER_MEDIUM: {
      const filterFn =
        action.values.length > 0
          ? (value: ListItemValue) =>
              value.medium ? action.values.includes(value.medium) : false
          : undefined;
      return {
        ...updatePendingFilter(state, "media", filterFn, action.values),
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
      };
    }

    case Actions.PENDING_FILTER_RELEASE_YEAR: {
      const filterFn =
        action.values.length > 0
          ? (value: ListItemValue) => action.values.includes(value.releaseYear)
          : undefined;
      return {
        ...updatePendingFilter(state, "releaseYears", filterFn, action.values),
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
      };
    }

    case Actions.PENDING_FILTER_TITLE: {
      return handlePendingFilterTitle(state, action.value, {
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
      });
    }

    case Actions.PENDING_FILTER_VENUE: {
      const filterFn =
        action.values.length > 0
          ? (value: ListItemValue) =>
              value.venue ? action.values.includes(value.venue) : false
          : undefined;
      return {
        ...updatePendingFilter(state, "venues", filterFn, action.values),
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
      };
    }

    case Actions.PENDING_FILTER_VIEWING_YEAR: {
      const filterFn =
        action.values.length > 0
          ? (value: ListItemValue) => action.values.includes(value.viewingYear)
          : undefined;
      return {
        ...updatePendingFilter(state, "viewingYears", filterFn, action.values),
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
      };
    }
    case Actions.PREV_MONTH: {
      newMonth = getPrevMonthWithViewings(
        state.currentMonth,
        state.filteredValues,
      );
      if (!newMonth) {
        return state; // No previous month with viewings
      }
      return {
        ...state,
        currentMonth: newMonth,
        hasNextMonth:
          getNextMonthWithViewings(newMonth, state.filteredValues) !==
          undefined,
        hasPrevMonth:
          getPrevMonthWithViewings(newMonth, state.filteredValues) !==
          undefined,
        monthViewings: getMonthViewings(state.filteredValues, newMonth),
      };
    }
    case Actions.RESET_PENDING_FILTERS: {
      return resetPendingFilters(state);
    }

    case Actions.SORT: {
      return updateSort(state, action.value);
    }

    // no default
  }
}

// Helper function to apply pending filters with month updates
function applyPendingFilters(state: State): State {
  const updatedState = basePendingFilters(state, sortValues, groupValues);
  const newMonth = getInitialMonth(
    updatedState.filteredValues,
    state.sortValue,
  );

  return {
    ...updatedState,
    currentMonth: newMonth,
    hasNextMonth:
      getNextMonthWithViewings(newMonth, updatedState.filteredValues) !==
      undefined,
    hasPrevMonth:
      getPrevMonthWithViewings(newMonth, updatedState.filteredValues) !==
      undefined,
    monthViewings: getMonthViewings(updatedState.filteredValues, newMonth),
  };
}

// Helper function to clear pending filters
function clearPendingFilters(state: State): State {
  return {
    ...baseClearPendingFilters(state),
    currentMonth: state.currentMonth,
    hasNextMonth: state.hasNextMonth,
    hasPrevMonth: state.hasPrevMonth,
    monthViewings: state.monthViewings,
  };
}

// Determine initial month based on sort order
function getInitialMonth(values: ListItemValue[], sortValue: Sort): Date {
  if (values.length === 0) {
    return new Date();
  }

  return sortValue === "viewing-date-asc"
    ? getOldestMonth(values)
    : getMostRecentMonth(values);
}

// Get all months that have viewings
function getMonthsWithViewings(values: ListItemValue[]): Set<string> {
  const months = new Set<string>();
  for (const value of values) {
    const date = new Date(value.viewingDate);
    const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    months.add(monthKey);
  }
  return months;
}

function getMonthViewings(
  values: ListItemValue[],
  month: Date,
): ListItemValue[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  return values.filter((value) => {
    const viewingDate = new Date(value.viewingDate);
    return (
      viewingDate.getUTCFullYear() === year &&
      viewingDate.getUTCMonth() === monthIndex
    );
  });
}

function getMostRecentMonth(values: ListItemValue[]): Date {
  if (values.length === 0) {
    return new Date();
  }

  // Get the most recent viewing date
  const sortedValues = [...values].sort(
    (a, b) => b.viewingSequence - a.viewingSequence,
  );
  const mostRecentDate = new Date(sortedValues[0].viewingDate);

  // Create a date for the first day of that month
  return new Date(
    mostRecentDate.getUTCFullYear(),
    mostRecentDate.getUTCMonth(),
    1,
  );
}

// Get next month that has viewings
function getNextMonthWithViewings(
  currentMonth: Date,
  values: ListItemValue[],
): Date | undefined {
  const monthsWithViewings = getMonthsWithViewings(values);
  let checkMonth = new Date(currentMonth);
  const mostRecent = getMostRecentMonth(values);

  while (checkMonth < mostRecent) {
    checkMonth = new Date(
      checkMonth.getFullYear(),
      checkMonth.getMonth() + 1,
      1,
    );
    const monthKey = `${checkMonth.getFullYear()}-${checkMonth.getMonth()}`;
    if (monthsWithViewings.has(monthKey)) {
      return checkMonth;
    }
  }
  return undefined;
}

function getOldestMonth(values: ListItemValue[]): Date {
  if (values.length === 0) {
    return new Date();
  }

  // Get the oldest viewing date
  const sortedValues = [...values].sort(
    (a, b) => a.viewingSequence - b.viewingSequence,
  );
  const oldestDate = new Date(sortedValues[0].viewingDate);

  // Create a date for the first day of that month
  return new Date(oldestDate.getUTCFullYear(), oldestDate.getUTCMonth(), 1);
}

// Get previous month that has viewings
function getPrevMonthWithViewings(
  currentMonth: Date,
  values: ListItemValue[],
): Date | undefined {
  const monthsWithViewings = getMonthsWithViewings(values);
  let checkMonth = new Date(currentMonth);
  const oldest = getOldestMonth(values);

  while (checkMonth > oldest) {
    checkMonth = new Date(
      checkMonth.getFullYear(),
      checkMonth.getMonth() - 1,
      1,
    );
    const monthKey = `${checkMonth.getFullYear()}-${checkMonth.getMonth()}`;
    if (monthsWithViewings.has(monthKey)) {
      return checkMonth;
    }
  }
  return undefined;
}

// Helper function to reset pending filters
function resetPendingFilters(state: State): State {
  return {
    ...baseResetPendingFilters(state),
    currentMonth: state.currentMonth,
    hasNextMonth: state.hasNextMonth,
    hasPrevMonth: state.hasPrevMonth,
    monthViewings: state.monthViewings,
  };
}

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "viewing-date-asc": (a, b) => a.viewingSequence - b.viewingSequence,
      "viewing-date-desc": (a, b) => b.viewingSequence - a.viewingSequence,
    };

  const comparer = sortMap[sortOrder];
  return [...values].sort(comparer); // Create a copy before sorting
}

// Helper function to update sort with month updates
function updateSort(state: State, sortValue: Sort): State {
  const updatedState = baseUpdateSort(
    state,
    sortValue,
    sortValues,
    groupValues,
  );
  const newMonth =
    sortValue === "viewing-date-asc"
      ? getOldestMonth(updatedState.filteredValues)
      : getMostRecentMonth(updatedState.filteredValues);
  const mostRecentMonth = getMostRecentMonth(updatedState.filteredValues);
  const oldestMonth = getOldestMonth(updatedState.filteredValues);

  return {
    ...updatedState,
    currentMonth: newMonth,
    hasNextMonth: newMonth < mostRecentMonth,
    hasPrevMonth: newMonth > oldestMonth,
    monthViewings: getMonthViewings(updatedState.filteredValues, newMonth),
  };
}
