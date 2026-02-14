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

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createReleaseYearFilterChangedAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createTitleFilterChangedAction,
  selectHasPendingFilters,
} from "~/reducers/titleFiltersReducer";

/**
 * Union type of all actions for viewings state management.
 */
export type ViewingsAction =
  | MediumFilterChangedAction
  | NextMonthClickedAction
  | PreviousMonthClickedAction
  | ReviewedStatusFilterChangedAction
  | SortAction<ViewingsSort>
  | TitleFiltersAction
  | VenueFilterChangedAction
  | ViewingYearFilterChangedAction;

import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

/**
 * Filter values for viewings.
 */
export type ViewingsFiltersValues = Omit<TitleFiltersValues, "genres"> & {
  medium?: readonly string[];
  reviewedStatus?: readonly string[];
  venue?: readonly string[];
  viewingYear?: [string, string];
};

type MediumFilterChangedAction = {
  type: "viewings/mediumChanged";
  values: readonly string[];
};

type NextMonthClickedAction = {
  type: "viewings/nextMonthClicked";
  value: string;
};

type PreviousMonthClickedAction = {
  type: "viewings/previousMonthClicked";
  value: string;
};

type ReviewedStatusFilterChangedAction = {
  type: "viewings/reviewedStatusChanged";
  values: readonly string[];
};

type VenueFilterChangedAction = {
  type: "viewings/venueChanged";
  values: readonly string[];
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
    pendingFilterValues: ViewingsFiltersValues;
    /** Value of the first viewing date in the selected month via a next/prev month action */
    selectedMonthDate?: string;
  };

type ViewingYearFilterChangedAction = {
  type: "viewings/viewingYearChanged";
  values: [string, string];
};

/**
 * Creates the initial state for viewings.
 * @param options - Configuration options
 * @param options.initialSort - Initial sort configuration
 * @param options.values - Viewing values
 * @returns Initial state for viewings reducer
 */
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
  };
}

/**
 * Creates an action for changing the medium filter.
 * @param values - The medium values to filter by
 * @returns Medium filter changed action
 */
export function createMediumFilterChangedAction(
  values: readonly string[],
): MediumFilterChangedAction {
  return { type: "viewings/mediumChanged", values };
}

/**
 * Creates an action for navigating to the next month.
 * @param value - The month value
 * @returns Next month clicked action
 */
export function createNextMonthClickedAction(
  value: string,
): NextMonthClickedAction {
  return { type: "viewings/nextMonthClicked", value };
}

/**
 * Creates an action for navigating to the previous month.
 * @param value - The month value
 * @returns Previous month clicked action
 */
export function createPreviousMonthClickedAction(
  value: string,
): PreviousMonthClickedAction {
  return { type: "viewings/previousMonthClicked", value };
}

/**
 * Creates an action for changing the reviewed status filter.
 * @param values - The reviewed status values to filter by
 * @returns Reviewed status filter changed action
 */
export function createReviewedStatusFilterChangedAction(
  values: readonly string[],
): ReviewedStatusFilterChangedAction {
  return { type: "viewings/reviewedStatusChanged", values };
}

/**
 * Creates an action for changing the venue filter.
 * @param values - The venue values to filter by
 * @returns Venue filter changed action
 */
export function createVenueFilterChangedAction(
  values: readonly string[],
): VenueFilterChangedAction {
  return { type: "viewings/venueChanged", values };
}

/**
 * Creates an action for changing the viewing year filter.
 * @param values - The year range values
 * @returns Viewing year filter changed action
 */
export function createViewingYearFilterChangedAction(
  values: [string, string],
): ViewingYearFilterChangedAction {
  return { type: "viewings/viewingYearChanged", values };
}

/**
 * Reducer function for viewings state management.
 * @param state - Current state
 * @param action - Action to process
 * @returns Updated state
 */
export function reducer(state: ViewingsState, action: ViewingsAction) {
  switch (action.type) {
    case "filters/applied": {
      const newState = titleFiltersReducer(state, action);

      return {
        ...newState,
        selectedMonthDate: undefined,
      };
    }
    case "filters/removeAppliedFilter": {
      return handleRemoveAppliedFilter(state, action);
    }
    case "sort/sort": {
      const newState = sortReducer(state, action);

      return {
        ...newState,
        selectedMonthDate: undefined,
      };
    }
    case "viewings/mediumChanged": {
      return handleMediumFilterChanged(state, action);
    }
    case "viewings/nextMonthClicked": {
      return handleNextMonthClicked(state, action);
    }
    case "viewings/previousMonthClicked": {
      return handlePreviousMonthClicked(state, action);
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
      medium: action.values.length === 0 ? undefined : action.values,
    },
  };
}

function handleNextMonthClicked(
  state: ViewingsState,
  action: NextMonthClickedAction,
) {
  return {
    ...state,
    selectedMonthDate: action.value,
  };
}

function handlePreviousMonthClicked(
  state: ViewingsState,
  action: PreviousMonthClickedAction,
) {
  return {
    ...state,
    selectedMonthDate: action.value,
  };
}

function handleRemoveAppliedFilter(
  state: ViewingsState,
  action: { filterKey: string; type: "filters/removeAppliedFilter" },
): ViewingsState {
  // Handle removal of individual medium values (e.g., "medium-blu-ray")
  if (action.filterKey.startsWith("medium-")) {
    const mediumValue = action.filterKey
      .replace(/^medium-/, "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const currentMedium = state.pendingFilterValues.medium ?? [];
    const newMedium = currentMedium.filter((m) => m !== mediumValue);

    return {
      ...state,
      pendingFilterValues: {
        ...state.pendingFilterValues,
        medium: newMedium.length === 0 ? undefined : newMedium,
      },
    };
  }

  // Handle removal of individual venue values (e.g., "venue-home")
  if (action.filterKey.startsWith("venue-")) {
    const venueValue = action.filterKey
      .replace(/^venue-/, "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const currentVenue = state.pendingFilterValues.venue ?? [];
    const newVenue = currentVenue.filter((v) => v !== venueValue);

    return {
      ...state,
      pendingFilterValues: {
        ...state.pendingFilterValues,
        venue: newVenue.length === 0 ? undefined : newVenue,
      },
    };
  }

  // Handle removal of individual reviewed status values (e.g., "reviewedStatus-reviewed")
  if (action.filterKey.startsWith("reviewedStatus-")) {
    const statusValue = action.filterKey
      .replace(/^reviewedStatus-/, "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const currentStatus = state.pendingFilterValues.reviewedStatus ?? [];
    const newStatus = currentStatus.filter((s) => s !== statusValue);

    return {
      ...state,
      pendingFilterValues: {
        ...state.pendingFilterValues,
        reviewedStatus: newStatus.length === 0 ? undefined : newStatus,
      },
    };
  }

  // For all other filters, use the default behavior (remove entire filter)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [action.filterKey]: _removed, ...remainingFilters } =
    state.pendingFilterValues as Record<string, unknown>;

  return {
    ...state,
    pendingFilterValues: remainingFilters as ViewingsFiltersValues,
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
      reviewedStatus: action.values.length === 0 ? undefined : action.values,
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
      venue: action.values.length === 0 ? undefined : action.values,
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

/**
 * Action creator for viewings sort actions.
 */
export const createSortAction = createSortActionCreator<ViewingsSort>();
