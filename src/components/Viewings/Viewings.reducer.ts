import type { ListItemValue } from "./Viewings";

export enum Actions {
  APPLY_PENDING_FILTERS = "APPLY_PENDING_FILTERS",
  CLEAR_PENDING_FILTERS = "CLEAR_PENDING_FILTERS",
  FILTER_MEDIUM = "FILTER_MEDIUM",
  FILTER_RELEASE_YEAR = "FILTER_RELEASE_YEAR",
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_VENUE = "FILTER_VENUE",
  FILTER_VIEWING_YEAR = "FILTER_VIEWING_YEAR",
  NEXT_MONTH = "NEXT_MONTH",
  // New actions for pending filters
  PENDING_FILTER_MEDIUM = "PENDING_FILTER_MEDIUM",
  PENDING_FILTER_RELEASE_YEAR = "PENDING_FILTER_RELEASE_YEAR",
  PENDING_FILTER_TITLE = "PENDING_FILTER_TITLE",
  PENDING_FILTER_VENUE = "PENDING_FILTER_VENUE",
  PENDING_FILTER_VIEWING_YEAR = "PENDING_FILTER_VIEWING_YEAR",
  PREV_MONTH = "PREV_MONTH",
  RESET_PENDING_FILTERS = "RESET_PENDING_FILTERS",
  SORT = "SORT",
}

export type ActionType =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | FilterMediumAction
  | FilterReleaseYearAction
  | FilterTitleAction
  | FilterVenueAction
  | FilterViewingYearAction
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

type FilterMediumAction = {
  type: Actions.FILTER_MEDIUM;
  values: string[];
};

type FilterReleaseYearAction = {
  type: Actions.FILTER_RELEASE_YEAR;
  values: string[];
};

type FilterTitleAction = {
  type: Actions.FILTER_TITLE;
  value: string;
};

type FilterVenueAction = {
  type: Actions.FILTER_VENUE;
  values: string[];
};

type FilterViewingYearAction = {
  type: Actions.FILTER_VIEWING_YEAR;
  values: string[];
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

type State = {
  allValues: ListItemValue[];
  currentMonth: Date;
  filteredValues: ListItemValue[];
  filters: {
    media: string[];
    releaseYears: string[];
    title: string;
    venues: string[];
    viewingYears: string[];
  };
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
  monthViewings: ListItemValue[];
  pendingFilteredCount: number; // Count of results with pending filters
  // AIDEV-NOTE: Pending filters store the user's selections before applying
  pendingFilters: {
    media: string[];
    releaseYears: string[];
    title: string;
    venues: string[];
    viewingYears: string[];
  };
  sortValue: Sort;
};

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  const sortedValues = sortValues(values, initialSort);
  const currentMonth = getInitialMonth(sortedValues, initialSort);
  const monthViewings = getMonthViewings(sortedValues, currentMonth);
  const initialFilters = {
    media: [],
    releaseYears: [],
    title: "",
    venues: [],
    viewingYears: [],
  };

  return {
    allValues: values, // Keep original unsorted values
    currentMonth,
    filteredValues: sortedValues,
    filters: initialFilters,
    hasNextMonth:
      getNextMonthWithViewings(currentMonth, sortedValues) !== undefined,
    hasPrevMonth:
      getPrevMonthWithViewings(currentMonth, sortedValues) !== undefined,
    monthViewings,
    pendingFilteredCount: sortedValues.length,
    pendingFilters: { ...initialFilters },
    sortValue: initialSort,
  };
}

export function reducer(state: State, action: ActionType): State {
  let filters;
  let filteredValues;
  let newMonth;
  let oldestMonth;
  let mostRecentMonth;

  switch (action.type) {
    case Actions.APPLY_PENDING_FILTERS: {
      // Apply pending filters to actual filters
      filteredValues = filterValues(state.allValues, state.pendingFilters);
      filteredValues = sortValues(filteredValues, state.sortValue);
      newMonth = getInitialMonth(filteredValues, state.sortValue);
      return {
        ...state,
        currentMonth: newMonth,
        filteredValues,
        filters: { ...state.pendingFilters },
        hasNextMonth:
          getNextMonthWithViewings(newMonth, filteredValues) !== undefined,
        hasPrevMonth:
          getPrevMonthWithViewings(newMonth, filteredValues) !== undefined,
        monthViewings: getMonthViewings(filteredValues, newMonth),
      };
    }
    case Actions.CLEAR_PENDING_FILTERS: {
      // Clear all pending filters to empty/default values
      const clearedFilters = {
        media: [],
        releaseYears: [],
        title: "",
        venues: [],
        viewingYears: [],
      };
      const pendingFilteredValues = filterValues(
        state.allValues,
        clearedFilters,
      );
      return {
        ...state,
        pendingFilteredCount: pendingFilteredValues.length,
        pendingFilters: clearedFilters,
      };
    }
    case Actions.FILTER_MEDIUM: {
      filters = {
        ...state.filters,
        media: action.values,
      };
      filteredValues = filterValues(state.allValues, filters);
      filteredValues = sortValues(filteredValues, state.sortValue);
      newMonth = getInitialMonth(filteredValues, state.sortValue);
      return {
        ...state,
        currentMonth: newMonth,
        filteredValues,
        filters,
        hasNextMonth:
          getNextMonthWithViewings(newMonth, filteredValues) !== undefined,
        hasPrevMonth:
          getPrevMonthWithViewings(newMonth, filteredValues) !== undefined,
        monthViewings: getMonthViewings(filteredValues, newMonth),
      };
    }
    case Actions.FILTER_RELEASE_YEAR: {
      filters = {
        ...state.filters,
        releaseYears: action.values,
      };
      filteredValues = filterValues(state.allValues, filters);
      filteredValues = sortValues(filteredValues, state.sortValue);
      newMonth = getInitialMonth(filteredValues, state.sortValue);
      return {
        ...state,
        currentMonth: newMonth,
        filteredValues,
        filters,
        hasNextMonth:
          getNextMonthWithViewings(newMonth, filteredValues) !== undefined,
        hasPrevMonth:
          getPrevMonthWithViewings(newMonth, filteredValues) !== undefined,
        monthViewings: getMonthViewings(filteredValues, newMonth),
      };
    }
    case Actions.FILTER_TITLE: {
      filters = {
        ...state.filters,
        title: action.value,
      };
      filteredValues = filterValues(state.allValues, filters);
      filteredValues = sortValues(filteredValues, state.sortValue);
      newMonth = getInitialMonth(filteredValues, state.sortValue);
      return {
        ...state,
        currentMonth: newMonth,
        filteredValues,
        filters,
        hasNextMonth:
          getNextMonthWithViewings(newMonth, filteredValues) !== undefined,
        hasPrevMonth:
          getPrevMonthWithViewings(newMonth, filteredValues) !== undefined,
        monthViewings: getMonthViewings(filteredValues, newMonth),
      };
    }
    case Actions.FILTER_VENUE: {
      filters = {
        ...state.filters,
        venues: action.values,
      };
      filteredValues = filterValues(state.allValues, filters);
      filteredValues = sortValues(filteredValues, state.sortValue);
      newMonth = getInitialMonth(filteredValues, state.sortValue);
      return {
        ...state,
        currentMonth: newMonth,
        filteredValues,
        filters,
        hasNextMonth:
          getNextMonthWithViewings(newMonth, filteredValues) !== undefined,
        hasPrevMonth:
          getPrevMonthWithViewings(newMonth, filteredValues) !== undefined,
        monthViewings: getMonthViewings(filteredValues, newMonth),
      };
    }
    case Actions.FILTER_VIEWING_YEAR: {
      filters = {
        ...state.filters,
        viewingYears: action.values,
      };
      filteredValues = filterValues(state.allValues, filters);
      filteredValues = sortValues(filteredValues, state.sortValue);
      newMonth = getInitialMonth(filteredValues, state.sortValue);
      return {
        ...state,
        currentMonth: newMonth,
        filteredValues,
        filters,
        hasNextMonth:
          getNextMonthWithViewings(newMonth, filteredValues) !== undefined,
        hasPrevMonth:
          getPrevMonthWithViewings(newMonth, filteredValues) !== undefined,
        monthViewings: getMonthViewings(filteredValues, newMonth),
      };
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
    // AIDEV-NOTE: Pending filter actions only update pendingFilters and count
    case Actions.PENDING_FILTER_MEDIUM: {
      const newPendingFilters = {
        ...state.pendingFilters,
        media: action.values,
      };
      const pendingFilteredValues = filterValues(
        state.allValues,
        newPendingFilters,
      );
      return {
        ...state,
        pendingFilteredCount: pendingFilteredValues.length,
        pendingFilters: newPendingFilters,
      };
    }
    case Actions.PENDING_FILTER_RELEASE_YEAR: {
      const newPendingFilters = {
        ...state.pendingFilters,
        releaseYears: action.values,
      };
      const pendingFilteredValues = filterValues(
        state.allValues,
        newPendingFilters,
      );
      return {
        ...state,
        pendingFilteredCount: pendingFilteredValues.length,
        pendingFilters: newPendingFilters,
      };
    }
    case Actions.PENDING_FILTER_TITLE: {
      const newPendingFilters = {
        ...state.pendingFilters,
        title: action.value,
      };
      const pendingFilteredValues = filterValues(
        state.allValues,
        newPendingFilters,
      );
      return {
        ...state,
        pendingFilteredCount: pendingFilteredValues.length,
        pendingFilters: newPendingFilters,
      };
    }
    case Actions.PENDING_FILTER_VENUE: {
      const newPendingFilters = {
        ...state.pendingFilters,
        venues: action.values,
      };
      const pendingFilteredValues = filterValues(
        state.allValues,
        newPendingFilters,
      );
      return {
        ...state,
        pendingFilteredCount: pendingFilteredValues.length,
        pendingFilters: newPendingFilters,
      };
    }
    case Actions.PENDING_FILTER_VIEWING_YEAR: {
      const newPendingFilters = {
        ...state.pendingFilters,
        viewingYears: action.values,
      };
      const pendingFilteredValues = filterValues(
        state.allValues,
        newPendingFilters,
      );
      return {
        ...state,
        pendingFilteredCount: pendingFilteredValues.length,
        pendingFilters: newPendingFilters,
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
      // Reset pending filters to current applied filters
      const pendingFilteredValues = filterValues(
        state.allValues,
        state.filters,
      );
      return {
        ...state,
        pendingFilteredCount: pendingFilteredValues.length,
        pendingFilters: { ...state.filters },
      };
    }
    case Actions.SORT: {
      // First filter, then sort
      filteredValues = filterValues(state.allValues, state.filters);
      filteredValues = sortValues(filteredValues, action.value);

      // Determine which month to show based on sort order
      newMonth =
        action.value === "viewing-date-asc"
          ? getOldestMonth(filteredValues) // For ascending sort, go to oldest month
          : getMostRecentMonth(filteredValues); // For descending sort, go to most recent month

      mostRecentMonth = getMostRecentMonth(filteredValues);
      oldestMonth = getOldestMonth(filteredValues);

      return {
        ...state,
        currentMonth: newMonth,
        filteredValues,
        hasNextMonth: newMonth < mostRecentMonth,
        hasPrevMonth: newMonth > oldestMonth,
        monthViewings: getMonthViewings(filteredValues, newMonth),
        sortValue: action.value,
      };
    }
    default: {
      return state;
    }
  }
}

function filterValues(
  values: ListItemValue[],
  filters: State["filters"],
): ListItemValue[] {
  return values.filter((value) => {
    if (
      filters.releaseYears.length > 0 &&
      !filters.releaseYears.includes(value.releaseYear)
    ) {
      return false;
    }

    if (
      filters.viewingYears.length > 0 &&
      !filters.viewingYears.includes(value.viewingYear)
    ) {
      return false;
    }

    if (
      filters.media.length > 0 &&
      (!value.medium || !filters.media.includes(value.medium))
    ) {
      return false;
    }

    if (
      filters.venues.length > 0 &&
      (!value.venue || !filters.venues.includes(value.venue))
    ) {
      return false;
    }

    if (
      filters.title &&
      !value.title.toLowerCase().includes(filters.title.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
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

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "viewing-date-asc": (a, b) => a.viewingSequence - b.viewingSequence,
      "viewing-date-desc": (a, b) => b.viewingSequence - a.viewingSequence,
    };

  const comparer = sortMap[sortOrder];
  return [...values].sort(comparer); // Create a copy before sorting
}
