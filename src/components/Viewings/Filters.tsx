import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./Viewings.reducer";

import { Actions } from "./Viewings.reducer";

export function Filters({
  dispatch,
  distinctMedia,
  distinctReleaseYears,
  distinctVenues,
  distinctViewingYears,
  filterKey,
  pendingFilters,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  filterKey?: string;
  pendingFilters: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >;
}) {
  return (
    <>
      <TextFilter
        initialValue={(pendingFilters.title as string) || ""}
        key={`title-${filterKey}`}
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearInput
        initialValues={(pendingFilters.releaseYears as string[]) || []}
        key={`release-year-${filterKey}`}
        label="Release Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_RELEASE_YEAR, values })
        }
        years={distinctReleaseYears}
      />
      <YearInput
        initialValues={(pendingFilters.viewingYears as string[]) || []}
        key={`viewing-year-${filterKey}`}
        label="Viewing Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_VIEWING_YEAR, values })
        }
        years={distinctViewingYears}
      />
      <SelectField
        label="Medium"
        onChange={(e) =>
          dispatch({
            type: Actions.PENDING_FILTER_MEDIUM,
            values:
              e.target.value === "All" || !e.target.value
                ? []
                : [e.target.value],
          })
        }
        value={((pendingFilters.media as string[]) || [])[0] || ""}
      >
        <SelectOptions options={distinctMedia} />
      </SelectField>
      <SelectField
        label="Venue"
        onChange={(e) =>
          dispatch({
            type: Actions.PENDING_FILTER_VENUE,
            values:
              e.target.value === "All" || !e.target.value
                ? []
                : [e.target.value],
          })
        }
        value={((pendingFilters.venues as string[]) || [])[0] || ""}
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
