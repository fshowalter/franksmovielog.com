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
 * Type definition for Reviews page filter values
 */
export type ViewingsFiltersValues = Omit<TitleFiltersValues, "genres"> & {
  medium?: string;
  reviewedStatus?: string;
  venue?: string;
  viewingYear?: [string, string];
};

type MediumFilterChangedAction = {
  type: "viewings/mediumChanged";
  value: string;
};

type NextMonthClickedAction = {
  type: "viewings/nextMonthClicked";
  value: {
    month: string;
    year: string;
  };
};

type PreviousMonthClickedAction = {
  type: "viewings/previousMonthClicked";
  value: {
    month: string;
    year: string;
  };
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
    currentMonth: {
      month: string;
      year: string;
    };
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
    currentMonth: {
      month: values[0].viewingMonthShort,
      year: values[0].viewingYear,
    },
  };
}

export function createMediumFilterChangedAction(
  value: string,
): MediumFilterChangedAction {
  return { type: "viewings/mediumChanged", value };
}

export function createNextMonthClickedAction(value: {
  month: string;
  year: string;
}): NextMonthClickedAction {
  return { type: "viewings/nextMonthClicked", value };
}

export function createPreviousMonthClickedAction(value: {
  month: string;
  year: string;
}): PreviousMonthClickedAction {
  return { type: "viewings/previousMonthClicked", value };
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
      const newState = sortReducer(state, action);

      const startingViewing =
        action.value === "viewing-date-asc"
          ? newState.values.at(-1)
          : newState.values[0];

      return {
        ...newState,
        currentMonth: {
          month: startingViewing!.viewingMonthShort,
          year: startingViewing!.viewingYear,
        },
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
      medium: action.value,
    },
  };
}

function handleNextMonthClicked(
  state: ViewingsState,
  action: NextMonthClickedAction,
) {
  return {
    ...state,
    currentMonth: action.value,
  };
}

function handlePreviousMonthClicked(
  state: ViewingsState,
  action: PreviousMonthClickedAction,
) {
  return {
    ...state,
    currentMonth: action.value,
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
