import type { FiltersAction } from "~/reducers/filtersReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { composeReducers } from "~/facets/composeReducers";
import { mediumFacetReducer } from "~/facets/medium/mediumReducer";
import { releaseYearFacetReducer } from "~/facets/releaseYear/releaseYearReducer";
import { reviewedStatusFacetReducer } from "~/facets/reviewedStatus/reviewedStatusReducer";
import { titleFacetReducer } from "~/facets/title/titleReducer";
import { venueFacetReducer } from "~/facets/venue/venueReducer";
import { viewingYearFacetReducer } from "~/facets/viewingYear/viewingYearReducer";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
} from "~/reducers/filtersReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export { createMediumFilterChangedAction } from "~/facets/medium/mediumReducer";
export { createReleaseYearFilterChangedAction } from "~/facets/releaseYear/releaseYearReducer";
export { createReviewedStatusFilterChangedAction } from "~/facets/reviewedStatus/reviewedStatusReducer";
export { createTitleFilterChangedAction } from "~/facets/title/titleReducer";
export { createVenueFilterChangedAction } from "~/facets/venue/venueReducer";
export { createViewingYearFilterChangedAction } from "~/facets/viewingYear/viewingYearReducer";
export { createRemoveAppliedFilterAction } from "~/reducers/filtersReducer";

import type { MediumFilterChangedAction } from "~/facets/medium/mediumReducer";
import type { ReleaseYearFilterChangedAction } from "~/facets/releaseYear/releaseYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/facets/reviewedStatus/reviewedStatusReducer";
import type { TitleFilterChangedAction } from "~/facets/title/titleReducer";
import type { VenueFilterChangedAction } from "~/facets/venue/venueReducer";
import type { ViewingYearFilterChangedAction } from "~/facets/viewingYear/viewingYearReducer";

import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

export type ViewingsAction =
  | FiltersAction
  | MediumFilterChangedAction
  | NextMonthClickedAction
  | PreviousMonthClickedAction
  | ReleaseYearFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | SortAction<ViewingsSort>
  | TitleFilterChangedAction
  | VenueFilterChangedAction
  | ViewingYearFilterChangedAction;

export type ViewingsFiltersValues = {
  medium?: readonly string[];
  releaseYear?: [string, string];
  reviewedStatus?: readonly string[];
  title?: string;
  venue?: readonly string[];
  viewingYear?: [string, string];
};

type NextMonthClickedAction = {
  type: "viewings/nextMonthClicked";
  value: string;
};

type PreviousMonthClickedAction = {
  type: "viewings/previousMonthClicked";
  value: string;
};

type ViewingsState = {
  activeFilterValues: ViewingsFiltersValues;
  pendingFilterValues: ViewingsFiltersValues;
  /** Value of the first viewing date in the selected month via a next/prev month action */
  selectedMonthDate?: string;
  sort: ViewingsSort;
  values: ViewingsValue[];
};

export function createNextMonthClickedAction(
  value: string,
): NextMonthClickedAction {
  return { type: "viewings/nextMonthClicked", value };
}

export function createPreviousMonthClickedAction(
  value: string,
): PreviousMonthClickedAction {
  return { type: "viewings/previousMonthClicked", value };
}

const viewingsComposedReducer = composeReducers<ViewingsState>(
  filtersLifecycleReducer,
  titleFacetReducer,
  releaseYearFacetReducer,
  reviewedStatusFacetReducer,
  mediumFacetReducer,
  venueFacetReducer,
  viewingYearFacetReducer,
  sortReducer,
  // AIDEV-NOTE: Clear selectedMonthDate when sort changes or filters are applied.
  (state, action) =>
    action.type === "sort/sort" || action.type === "filters/applied"
      ? { ...state, selectedMonthDate: undefined }
      : state,
  // Month navigation actions: set selectedMonthDate
  (state, action) => {
    if (
      action.type === "viewings/nextMonthClicked" ||
      action.type === "viewings/previousMonthClicked"
    ) {
      return {
        ...state,
        selectedMonthDate: (
          action as NextMonthClickedAction | PreviousMonthClickedAction
        ).value,
      };
    }
    return state;
  },
);

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: ViewingsSort;
  values: ViewingsValue[];
}): ViewingsState {
  return {
    ...createInitialFiltersState({ values }),
    ...createInitialSortState({ initialSort }),
  };
}

export function reducer(
  state: ViewingsState,
  action: ViewingsAction,
): ViewingsState {
  return viewingsComposedReducer(state, action);
}

export const createSortAction = createSortActionCreator<ViewingsSort>();
