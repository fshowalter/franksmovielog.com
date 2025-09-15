import type { SortAction, SortState } from "~/reducers/sortReducer";
import type {
  TitleFiltersAction,
  TitleFiltersState,
  TitleFiltersValues,
} from "~/reducers/titleFiltersReducer";

import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";
import {
  createInitialTitleFiltersState,
  titleFiltersReducer,
} from "~/reducers/titleFiltersReducer";

export { createShowMoreAction } from "~/reducers/showMoreReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createGenresFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createResetFiltersAction,
  createTitleFilterChangedAction,
  selectHasPendingFilters,
} from "~/reducers/titleFiltersReducer";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type ViewingsAction =
  | MediumFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | SortAction<ViewingsSort>
  | TitleFiltersAction
  | VenueFilterChangedAction
  | ViewingYearFilterChangedAction;

import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

/**
 * Type definition for Reviews page filter values
 */
export type ViewingsFiltersValues = TitleFiltersValues & {
  medium?: string;
  reviewedStatus?: string;
  venue?: string;
  viewingYear?: [string, string];
};

type MediumFilterChangedAction = {
  type: "viewings/mediumChanged";
  value: string;
};

type ReviewedStatusFilterChangedAction = {
  type: "viewings/reviewedStatusChanged";
  value: string;
};

type VenueFilterChangedAction = {
  type: "viewings/venueChanged";
  value: string;
};

/**
 * Internal state type for Reviews page reducer
 */
type ViewingsState = Omit<
  TitleFiltersState<ViewingsValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  SortState<ViewingsSort> & {
    activeFilterValues: ViewingsFiltersValues;
    currentMonth: Date;
    pendingFilterValues: ViewingsFiltersValues;
  };

type ViewingYearFilterChangedAction = {
  type: "viewings/viewingYearChanged";
  values: [string, string];
};

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: ViewingsSort;
  values: ViewingsValue[];
}): ViewingsState {
  const sortState = createInitialSortState({ initialSort });
  const titleFilterState = createInitialTitleFiltersState({
    values,
  });

  return {
    ...titleFilterState,
    ...sortState,
    currentMonth: getInitialMonth(values, initialSort),
  };
}

export function createMediumFilterChangedAction(
  value: string,
): MediumFilterChangedAction {
  return { type: "viewings/mediumChanged", value };
}

export function createReviewedStatusFilterChangedAction(
  value: string,
): ReviewedStatusFilterChangedAction {
  return { type: "viewings/reviewedStatusChanged", value };
}

export function createVenueFilterChangedAction(
  value: string,
): VenueFilterChangedAction {
  return { type: "viewings/venueChanged", value };
}

export function createViewingYearFilterChangedAction(
  values: [string, string],
): ViewingYearFilterChangedAction {
  return { type: "viewings/viewingYearChanged", values };
}

/**
 * Reducer function for managing Reviews page state.
 * Handles filtering, sorting, and pagination actions for the reviews list.
 */
export function reducer(state: ViewingsState, action: ViewingsAction) {
  switch (action.type) {
    case "sort/sort": {
      return sortReducer(state, action);
    }
    case "viewings/mediumChanged": {
      return handleMediumFilterChanged(state, action);
    }
    case "viewings/reviewedStatusChanged": {
      return handleReviewedStatusFilterChanged(state, action);
    }
    case "viewings/venueChanged": {
      return handleVenueFilterChanged(state, action);
    }
    case "viewings/viewingYearChanged": {
      return handleViewingYearFilterChanged(state, action);
    }
    default: {
      return titleFiltersReducer(state, action);
    }
  }
}

function handleMediumFilterChanged(
  state: ViewingsState,
  action: MediumFilterChangedAction,
): ViewingsState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      medium: action.value,
    },
  };
}

function handleReviewedStatusFilterChanged(
  state: ViewingsState,
  action: ReviewedStatusFilterChangedAction,
): ViewingsState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      reviewedStatus: action.value,
    },
  };
}

function handleVenueFilterChanged(
  state: ViewingsState,
  action: VenueFilterChangedAction,
): ViewingsState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      venue: action.value,
    },
  };
}

function handleViewingYearFilterChanged(
  state: ViewingsState,
  action: ViewingYearFilterChangedAction,
): ViewingsState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      viewingYear: action.values,
    },
  };
}

export const createSortAction = createSortActionCreator<ViewingsSort>();

// Determine initial month based on sort order
function getInitialMonth(
  values: ViewingsValue[],
  sortValue: ViewingsSort,
): Date {
  if (values.length === 0) {
    return new Date();
  }

  return sortValue === "viewing-date-asc"
    ? getOldestMonth(values)
    : getMostRecentMonth(values);
}

function getOldestMonth(values: ViewingsValue[]): Date {
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
