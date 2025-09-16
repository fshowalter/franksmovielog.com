import { SelectField } from "~/components/fields/SelectField";
import { SelectOptions } from "~/components/fields/SelectOptions";
import { YearField } from "~/components/fields/YearField";
import { ReviewedStatusFilter } from "~/components/filter-and-sort/ReviewedStatusFilter";
import { TitleFilters } from "~/components/filter-and-sort/TitleFilters";

import type { ViewingsAction, ViewingsFiltersValues } from "./Viewings.reducer";

import {
  createMediumFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createReviewedStatusFilterChangedAction,
  createTitleFilterChangedAction,
  createVenueFilterChangedAction,
  createViewingYearFilterChangedAction,
} from "./Viewings.reducer";

export function Filters({
  dispatch,
  distinctMedia,
  distinctReleaseYears,
  distinctVenues,
  distinctViewingYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ViewingsAction>;
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  filterValues: ViewingsFiltersValues;
}): React.JSX.Element {
  return (
    <>
      <TitleFilters
        releaseYear={{
          initialValue: filterValues.releaseYear,
          onChange: (values) =>
            dispatch(createReleaseYearFilterChangedAction(values)),
          values: distinctReleaseYears,
        }}
        title={{
          initialValue: filterValues.title,
          onChange: (value) => dispatch(createTitleFilterChangedAction(value)),
        }}
      />
      <ReviewedStatusFilter
        initialValue={filterValues.reviewedStatus}
        onChange={(value) =>
          dispatch(createReviewedStatusFilterChangedAction(value))
        }
      />
      <YearField
        initialValues={filterValues.viewingYear}
        label="Viewing Year"
        onYearChange={(values) =>
          dispatch(createViewingYearFilterChangedAction(values))
        }
        years={distinctViewingYears}
      />
      <SelectField
        defaultValue={filterValues.medium}
        label="Medium"
        onChange={(value) => dispatch(createMediumFilterChangedAction(value))}
      >
        <SelectOptions options={distinctMedia} />
      </SelectField>
      <SelectField
        defaultValue={filterValues.venue}
        label="Venue"
        onChange={(value) => dispatch(createVenueFilterChangedAction(value))}
      >
        <SelectOptions options={distinctVenues} />
      </SelectField>
    </>
  );
}
