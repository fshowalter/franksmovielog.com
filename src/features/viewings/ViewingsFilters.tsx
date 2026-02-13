import type { CheckboxListFieldOption } from "~/components/fields/CheckboxListField";

import { CheckboxListField } from "~/components/fields/CheckboxListField";
import { YearField } from "~/components/fields/YearField";
import { FilterSection } from "~/components/filter-and-sort/FilterSection";
import { TitleFilters } from "~/components/filter-and-sort/TitleFilters";

import type { ViewingsValue } from "./Viewings";
import type { ViewingsAction, ViewingsFiltersValues } from "./Viewings.reducer";

import {
  calculateMediumCounts,
  calculateReviewedStatusCounts,
  calculateVenueCounts,
} from "./filterViewings";
import {
  createMediumFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createReviewedStatusFilterChangedAction,
  createTitleFilterChangedAction,
  createVenueFilterChangedAction,
  createViewingYearFilterChangedAction,
} from "./Viewings.reducer";

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
  // Calculate dynamic counts for each filter
  const mediumCounts = calculateMediumCounts([...values], filterValues);
  const venueCounts = calculateVenueCounts([...values], filterValues);
  const reviewedStatusCounts = calculateReviewedStatusCounts(
    [...values],
    filterValues,
  );

  // Build options with counts
  // Filter out "All" from distinct arrays since CheckboxListField doesn't need it
  const mediumOptions: CheckboxListFieldOption[] = distinctMedia
    .filter((medium) => medium !== "All")
    .map((medium) => ({
      count: mediumCounts.get(medium) ?? 0,
      label: medium,
      value: medium,
    }));

  // Filter out "All" from distinct arrays since CheckboxListField doesn't need it
  const venueOptions: CheckboxListFieldOption[] = distinctVenues
    .filter((venue) => venue !== "All")
    .map((venue) => ({
      count: venueCounts.get(venue) ?? 0,
      label: venue,
      value: venue,
    }));

  // Filter out "All" from distinct arrays since CheckboxListField doesn't need it
  const reviewedStatusOptions: CheckboxListFieldOption[] = [
    {
      count: reviewedStatusCounts.get("Reviewed") ?? 0,
      label: "Reviewed",
      value: "Reviewed",
    },
    {
      count: reviewedStatusCounts.get("Not Reviewed") ?? 0,
      label: "Not Reviewed",
      value: "Not Reviewed",
    },
  ];

  return (
    <>
      <TitleFilters
        releaseYear={{
          defaultValues: filterValues.releaseYear,
          onChange: (values) =>
            dispatch(createReleaseYearFilterChangedAction(values)),
          values: distinctReleaseYears,
        }}
        title={{
          defaultValue: filterValues.title,
          onChange: (value) => dispatch(createTitleFilterChangedAction(value)),
        }}
      />
      <FilterSection title="Reviewed Status">
        <CheckboxListField
          defaultValues={filterValues.reviewedStatus ?? []}
          label="Reviewed Status"
          onChange={(values) =>
            dispatch(createReviewedStatusFilterChangedAction(values))
          }
          onClear={() => dispatch(createReviewedStatusFilterChangedAction([]))}
          options={reviewedStatusOptions}
        />
      </FilterSection>
      <YearField
        defaultValues={filterValues.viewingYear}
        label="Viewing Year"
        onYearChange={(values) =>
          dispatch(createViewingYearFilterChangedAction(values))
        }
        years={distinctViewingYears}
      />
      <FilterSection title="Medium">
        <CheckboxListField
          defaultValues={filterValues.medium ?? []}
          label="Medium"
          onChange={(values) => dispatch(createMediumFilterChangedAction(values))}
          onClear={() => dispatch(createMediumFilterChangedAction([]))}
          options={mediumOptions}
        />
      </FilterSection>
      <FilterSection title="Venue">
        <CheckboxListField
          defaultValues={filterValues.venue ?? []}
          label="Venue"
          onChange={(values) => dispatch(createVenueFilterChangedAction(values))}
          onClear={() => dispatch(createVenueFilterChangedAction([]))}
          options={venueOptions}
        />
      </FilterSection>
    </>
  );
}
