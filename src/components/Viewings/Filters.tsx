import { ReviewedStatusFilter } from "~/components/ReviewedStatusFilter";
import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./Viewings.reducer";

import { Actions } from "./Viewings.reducer";

type FilterValues = {
  medium?: string;
  releaseYears?: string[];
  reviewStatus?: string;
  title?: string;
  venue?: string;
  viewingYears?: string[];
};

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
  filterValues: FilterValues;
}) {
  return (
    <>
      <ReviewedStatusFilter
        initialValue={filterValues.reviewStatus}
        onChange={(value) =>
          dispatch({
            type: Actions.PENDING_FILTER_REVIEW_STATUS,
            value,
          })
        }
      />
      <TextFilter
        initialValue={filterValues.title || ""}
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearInput
        initialValues={filterValues.releaseYears || []}
        label="Release Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_RELEASE_YEAR, values })
        }
        years={distinctReleaseYears}
      />
      <YearInput
        initialValues={filterValues.viewingYears || []}
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

export function SortOptions(): React.ReactNode {
  return (
    <>
      <option value="viewing-date-desc">Viewing Date (Newest First)</option>
      <option value="viewing-date-asc">Viewing Date (Oldest First)</option>
    </>
  );
}
