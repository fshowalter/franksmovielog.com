import { MediumFacet } from "~/components/filter-and-sort/facets/medium/MediumFacet";
import { ReleaseYearFacet } from "~/components/filter-and-sort/facets/release-year/ReleaseYearFacet";
import { ReviewedStatusFacet } from "~/components/filter-and-sort/facets/reviewed-status/ReviewedStatusFacet";
import { TitleFacet } from "~/components/filter-and-sort/facets/title/TitleFacet";
import { VenueFacet } from "~/components/filter-and-sort/facets/venue/VenueFacet";
import { ViewingYearFacet } from "~/components/filter-and-sort/facets/viewing-year/ViewingYearFacet";

import type { ViewingsValue } from "./Viewings";
import type { ViewingsAction, ViewingsFiltersValues } from "./viewingsReducer";

import { filterViewings } from "./filterViewings";

/**
 * Filter controls for the viewings page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctMedia - Available media types for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctVenues - Available venues for filtering
 * @param props.distinctViewingYears - Available viewing years for filtering
 * @param props.filterValues - Current active filter values
 * @param props.values - All viewing values (for dynamic count calculation)
 * @returns Filter input components for viewings
 */
export function ViewingsFilters({
  dispatch,
  distinctMedia,
  distinctReleaseYears,
  distinctVenues,
  distinctViewingYears,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<ViewingsAction>;
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  filterValues: ViewingsFiltersValues;
  values: readonly ViewingsValue[];
}): React.JSX.Element {
  return (
    <>
      <TitleFacet defaultValue={filterValues.title} dispatch={dispatch} />
      <ReleaseYearFacet
        dispatch={dispatch}
        distinctYears={distinctReleaseYears}
        selectedValues={filterValues.releaseYear}
      />
      <ReviewedStatusFacet
        dispatch={dispatch}
        filterer={filterViewings}
        filterValues={filterValues}
        values={values}
      />
      <ViewingYearFacet
        dispatch={dispatch}
        distinctYears={distinctViewingYears}
        selectedValues={filterValues.viewingYear}
      />
      <MediumFacet
        dispatch={dispatch}
        distinctMedia={distinctMedia}
        filterer={filterViewings}
        filterValues={filterValues}
        values={values}
      />
      <VenueFacet
        dispatch={dispatch}
        distinctVenues={distinctVenues}
        filterer={filterViewings}
        filterValues={filterValues}
        values={values}
      />
    </>
  );
}
