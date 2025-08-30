import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { TitleFilters } from "~/components/TitleFilters";
import { YearInput } from "~/components/YearInput";

import type { ActionType, ViewingsFilterValues } from "./Viewings.reducer";

import { Actions } from "./Viewings.reducer";

export function Filters({
  dispatch,
  distinctMedia,
  distinctReleaseYears,
  distinctVenues,
  distinctViewingYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  filterValues: ViewingsFilterValues;
}): React.JSX.Element {
  return (
    <>
      <TitleFilters
        releaseYear={{
          initialValue: filterValues.releaseYear,
          onChange: (values) =>
            dispatch({ type: Actions.PENDING_FILTER_RELEASE_YEAR, values }),
          values: distinctReleaseYears,
        }}
        reviewedStatus={{
          initialValue: filterValues.reviewedStatus,
          onChange: (value) =>
            dispatch({
              type: Actions.PENDING_FILTER_REVIEWED_STATUS,
              value,
            }),
        }}
        title={{
          initialValue: filterValues.title,
          onChange: (value) =>
            dispatch({ type: Actions.PENDING_FILTER_TITLE, value }),
        }}
      />
      <YearInput
        initialValues={filterValues.viewingYears}
        label="Viewing Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_VIEWING_YEAR, values })
        }
        years={distinctViewingYears}
      />
      <SelectField
        initialValue={filterValues.medium}
        label="Medium"
        onChange={(value) =>
          dispatch({
            type: Actions.PENDING_FILTER_MEDIUM,
            value,
          })
        }
      >
        <SelectOptions options={distinctMedia} />
      </SelectField>
      <SelectField
        initialValue={filterValues.venue}
        label="Venue"
        onChange={(value) =>
          dispatch({
            type: Actions.PENDING_FILTER_VENUE,
            value,
          })
        }
      >
        <SelectOptions options={distinctVenues} />
      </SelectField>
    </>
  );
}
