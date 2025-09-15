import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import type {
  TitleFilterValues,
  TitlesActionType,
} from "~/components/ListWithFilters/titlesReducerUtils";
import type { GroupFn } from "~/components/utils/reducerUtils";

import {
  createInitialState,
  handleListWithFiltersAction,
  ListWithFiltersActions,
  updatePendingFilter,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  handleReleaseYearFilterAction,
  handleReviewedStatusFilterAction,
  handleTitleFilterAction,
  TitlesActions,
} from "~/components/ListWithFilters/titlesReducerUtils";
import { buildSortValues } from "~/components/utils/reducerUtils";

import type { ListItemValue } from "./Viewings";

enum ViewingsActions {
  NEXT_MONTH = "NEXT_MONTH",
  PENDING_FILTER_MEDIUM = "PENDING_FILTER_MEDIUM",
  PENDING_FILTER_VENUE = "PENDING_FILTER_VENUE",
  PENDING_FILTER_VIEWING_YEAR = "PENDING_FILTER_VIEWING_YEAR",
  PREV_MONTH = "PREV_MONTH",
}

export type ViewingsFilterValues = Pick<
  TitleFilterValues,
  "releaseYear" | "reviewedStatus" | "title"
> & {
  medium?: string;
  venue?: string;
  viewingYears?: [string, string];
};

// Re-export actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...TitlesActions,
  ...ViewingsActions,
} as const;

export type ActionType =
  | Extract<
      TitlesActionType,
      | { type: TitlesActions.PENDING_FILTER_RELEASE_YEAR }
      | { type: TitlesActions.PENDING_FILTER_REVIEWED_STATUS }
      | { type: TitlesActions.PENDING_FILTER_TITLE }
    >
  | ListWithFiltersActionType<Sort>
  | NextMonthAction
  | PendingFilterMediumAction
  | PendingFilterVenueAction
  | PendingFilterViewingYearAction
  | PrevMonthAction;

export type Sort = "viewing-date-asc" | "viewing-date-desc";

// Using shared action types from ListWithFilters

type NextMonthAction = {
  type: ViewingsActions.NEXT_MONTH;
};

type PendingFilterMediumAction = {
  type: ViewingsActions.PENDING_FILTER_MEDIUM;
  value: string;
};

// Using shared PendingFilterReleaseYearAction from ListWithFilters

// Using the shared PendingFilterTitleAction from ListWithFilters

type PendingFilterVenueAction = {
  type: ViewingsActions.PENDING_FILTER_VENUE;
  value: string;
};

type PendingFilterViewingYearAction = {
  type: ViewingsActions.PENDING_FILTER_VIEWING_YEAR;
  values: string[];
};

type PrevMonthAction = {
  type: ViewingsActions.PREV_MONTH;
};

// AIDEV-NOTE: Viewings state extends ListWithFiltersState with month navigation
type State = ListWithFiltersState<ListItemValue, Sort> & {
  currentMonth: Date;
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
  monthViewings: ListItemValue[];
  nextMonth: Date | undefined;
  prevMonth: Date | undefined;
};

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  const baseState = createInitialState({
    groupFn: groupValuesSortedBySequence,
    initialSort,
    showCount: undefined, // Viewings don't paginate
    sortFn: sortValues,
    values,
  });

  const currentMonth = getInitialMonth(baseState.filteredValues, initialSort);
  const monthViewings = getMonthViewings(
    baseState.filteredValues,
    currentMonth,
  );
  const nextMonth = getNextMonthWithViewings(
    currentMonth,
    baseState.filteredValues,
  );
  const prevMonth = getPrevMonthWithViewings(
    currentMonth,
    baseState.filteredValues,
  );

  return {
    ...baseState,
    currentMonth,
    hasNextMonth: nextMonth !== undefined,
    hasPrevMonth: prevMonth !== undefined,
    monthViewings,
    nextMonth,
    prevMonth,
  };
}

export function reducer(state: State, action: ActionType): State {
  let newMonth;

  switch (action.type) {
    // Field-specific shared filters
    case TitlesActions.PENDING_FILTER_RELEASE_YEAR: {
      return handleReleaseYearFilterAction(state, action, {
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      });
    }
    case TitlesActions.PENDING_FILTER_REVIEWED_STATUS: {
      return handleReviewedStatusFilterAction(state, action, {
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      });
    }

    case TitlesActions.PENDING_FILTER_TITLE: {
      return handleTitleFilterAction(state, action, {
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      });
    }

    case ViewingsActions.NEXT_MONTH: {
      newMonth = getNextMonthWithViewings(
        state.currentMonth,
        state.filteredValues,
      )!; // Bang operator - we know this exists because button is only rendered when hasNextMonth is true
      const nextMonth = getNextMonthWithViewings(
        newMonth,
        state.filteredValues,
      );
      const prevMonth = getPrevMonthWithViewings(
        newMonth,
        state.filteredValues,
      );
      return {
        ...state,
        currentMonth: newMonth,
        hasNextMonth: nextMonth !== undefined,
        hasPrevMonth: prevMonth !== undefined,
        monthViewings: getMonthViewings(state.filteredValues, newMonth),
        nextMonth,
        prevMonth,
      };
    }

    case ViewingsActions.PENDING_FILTER_MEDIUM: {
      const filterFn =
        action.value && action.value !== "All"
          ? (value: ListItemValue) => value.medium == action.value
          : undefined;
      const filterKey: keyof ViewingsFilterValues = "medium";
      return {
        ...updatePendingFilter(state, filterKey, filterFn, action.value),
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      };
    }
    case ViewingsActions.PENDING_FILTER_VENUE: {
      const filterFn =
        action.value && action.value !== "All"
          ? (value: ListItemValue) => value.venue == action.value
          : undefined;
      const filterKey: keyof ViewingsFilterValues = "venue";
      return {
        ...updatePendingFilter(state, filterKey, filterFn, action.value),
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      };
    }
    case ViewingsActions.PENDING_FILTER_VIEWING_YEAR: {
      const [minYear, maxYear] = action.values;
      const filterFn = (value: ListItemValue) =>
        value.viewingYear >= minYear && value.viewingYear <= maxYear;

      const filterKey: keyof ViewingsFilterValues = "viewingYears";
      return {
        ...updatePendingFilter(state, filterKey, filterFn, action.values),
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthViewings: state.monthViewings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      };
    }
    case ViewingsActions.PREV_MONTH: {
      newMonth = getPrevMonthWithViewings(
        state.currentMonth,
        state.filteredValues,
      )!; // Bang operator - we know this exists because button is only rendered when hasPrevMonth is true
      const nextMonth = getNextMonthWithViewings(
        newMonth,
        state.filteredValues,
      );
      const prevMonth = getPrevMonthWithViewings(
        newMonth,
        state.filteredValues,
      );
      return {
        ...state,
        currentMonth: newMonth,
        hasNextMonth: nextMonth !== undefined,
        hasPrevMonth: prevMonth !== undefined,
        monthViewings: getMonthViewings(state.filteredValues, newMonth),
        nextMonth,
        prevMonth,
      };
    }

    default: {
      // Handle shared list structure actions (no show more for this component)
      const result = handleListWithFiltersAction(
        state,
        action,
        { groupFn: groupValuesSortedBySequence, sortFn: sortValues },
        {
          currentMonth: state.currentMonth,
          hasNextMonth: state.hasNextMonth,
          hasPrevMonth: state.hasPrevMonth,
          monthViewings: state.monthViewings,
          nextMonth: state.nextMonth,
          prevMonth: state.prevMonth,
        },
      );

      // Update month-related state on APPLY_PENDING_FILTERS and SORT
      if (
        action.type === ListWithFiltersActions.APPLY_PENDING_FILTERS ||
        action.type === ListWithFiltersActions.SORT
      ) {
        // Always reset to initial month based on filtered results and sort order
        const newMonth = getInitialMonth(
          result.filteredValues,
          result.sortValue,
        );
        const nextMonth = getNextMonthWithViewings(
          newMonth,
          result.filteredValues,
        );
        const prevMonth = getPrevMonthWithViewings(
          newMonth,
          result.filteredValues,
        );

        return {
          ...result,
          currentMonth: newMonth,
          hasNextMonth: nextMonth !== undefined,
          hasPrevMonth: prevMonth !== undefined,
          monthViewings: getMonthViewings(result.filteredValues, newMonth),
          nextMonth,
          prevMonth,
        };
      }

      return result;
    }
  }
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
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();

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
      checkMonth.getUTCFullYear(),
      checkMonth.getUTCMonth() + 1,
      1,
    );
    const monthKey = `${checkMonth.getUTCFullYear()}-${checkMonth.getUTCMonth()}`;
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
      checkMonth.getUTCFullYear(),
      checkMonth.getUTCMonth() - 1,
      1,
    );
    const monthKey = `${checkMonth.getUTCFullYear()}-${checkMonth.getUTCMonth()}`;
    if (monthsWithViewings.has(monthKey)) {
      return checkMonth;
    }
  }
  return undefined;
}

// AIDEV-NOTE: Group viewings by date for calendar display
// Creates a map where keys are "year-month-day" and values are arrays of viewings for that day
function groupByDate(value: ListItemValue): string {
  const date = new Date(value.viewingDate);
  // Key format: "year-month-day" without padding (matches calendar lookup needs)
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

// Custom grouping function that sorts viewings within each day by sequence
// The sortValue parameter is required by the groupFn interface but not used here
const groupValuesSortedBySequence: GroupFn<ListItemValue, Sort> = (
  items: ListItemValue[],
): Map<string, ListItemValue[]> => {
  const grouped = new Map<string, ListItemValue[]>();

  for (const item of items) {
    const key = groupByDate(item);
    const group = grouped.get(key) || [];
    group.push(item);
    grouped.set(key, group);
  }

  // Sort viewings within each day by sequence
  for (const dayViewings of grouped.values()) {
    dayViewings.sort((a, b) => a.viewingSequence - b.viewingSequence);
  }

  return grouped;
};

const sortValues = buildSortValues<ListItemValue, Sort>({
  "viewing-date-asc": (a, b) => a.viewingSequence - b.viewingSequence,
  "viewing-date-desc": (a, b) => b.viewingSequence - a.viewingSequence,
});
