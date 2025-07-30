import { useImperativeHandle, useRef } from "react";

import type { FiltersHandle } from "~/components/ListWithFiltersLayout";

import {
  DebouncedInput,
  type DebouncedInputHandle,
} from "~/components/DebouncedInput";
import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./Viewings.reducer";

import { Actions } from "./Viewings.reducer";

export function Filters({
  dispatch,
  distinctMedia,
  distinctReleaseYears,
  distinctVenues,
  distinctViewingYears,
  ref,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctMedia: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctVenues: readonly string[];
  distinctViewingYears: readonly string[];
  ref: React.Ref<FiltersHandle>;
}) {
  const inputRef = useRef<DebouncedInputHandle>(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef?.current?.focus();
      },
    };
  }, []);

  return (
    <>
      <DebouncedInput
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
        ref={inputRef}
      />
      <YearInput
        label="Release Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_RELEASE_YEAR, values })
        }
        years={distinctReleaseYears}
      />
      <YearInput
        label="Viewing Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_VIEWING_YEAR, values })
        }
        years={distinctViewingYears}
      />
      <SelectField
        label="Medium"
        onChange={(e) =>
          dispatch({
            type: Actions.FILTER_MEDIUM,
            value: e.target.value,
          })
        }
      >
        <SelectOptions options={distinctMedia} />
      </SelectField>
      <SelectField
        label="Venue"
        onChange={(e) =>
          dispatch({
            type: Actions.FILTER_VENUE,
            value: e.target.value,
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
