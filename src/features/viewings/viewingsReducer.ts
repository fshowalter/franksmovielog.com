import type { FilterAndSortContainerAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import type { MediumFilterChangedAction } from "~/components/filter-and-sort/facets/medium/mediumReducer";
import type { ReleaseYearFilterChangedAction } from "~/components/filter-and-sort/facets/release-year/releaseYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import type { TitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";
import type { VenueFilterChangedAction } from "~/components/filter-and-sort/facets/venue/venueReducer";
import type { ViewingYearFilterChangedAction } from "~/components/filter-and-sort/facets/viewing-year/viewingYearReducer";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { composeReducers } from "~/components/filter-and-sort/facets/composeReducers";
import { mediumFacetReducer } from "~/components/filter-and-sort/facets/medium/mediumReducer";
import { releaseYearFacetReducer } from "~/components/filter-and-sort/facets/release-year/releaseYearReducer";
import { reviewedStatusFacetReducer } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import { titleFacetReducer } from "~/components/filter-and-sort/facets/title/titleReducer";
import { venueFacetReducer } from "~/components/filter-and-sort/facets/venue/venueReducer";
import { viewingYearFacetReducer } from "~/components/filter-and-sort/facets/viewing-year/viewingYearReducer";

import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

export type ViewingsAction =
  | FilterAndSortContainerAction<ViewingsSort>
  | MediumFilterChangedAction
  | NextMonthClickedAction
  | PreviousMonthClickedAction
  | ReleaseYearFilterChangedAction
  | ReviewedStatusFilterChangedAction
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
  filterAndSortContainerReducer,
  titleFacetReducer,
  releaseYearFacetReducer,
  reviewedStatusFacetReducer,
  mediumFacetReducer,
  venueFacetReducer,
  viewingYearFacetReducer,
  // AIDEV-NOTE: Clear selectedMonthDate when sort changes or filters are applied.
  (state, action) =>
    action.type === "filterAndSortContainer/sortChanged" ||
    action.type === "filterAndSortContainer/filtersApplied"
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
    ...createInitialFilterAndSortContainerState({ initialSort, values }),
  };
}

export function reducer(
  state: ViewingsState,
  action: ViewingsAction,
): ViewingsState {
  return viewingsComposedReducer(state, action);
}
