import type { JSX } from "react";

import { DebouncedInput } from "~/components/DebouncedInput";
import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { YearInput } from "~/components/YearInput";

import { Actions, type ActionType, type Sort } from "./Watchlist.reducer";

export function Filters({
  dispatch,
  distinctCollections,
  distinctDirectors,
  distinctPerformers,
  distinctReleaseYears,
  distinctWriters,
  sortValue,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctCollections: readonly string[];
  distinctDirectors: readonly string[];
  distinctPerformers: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctWriters: readonly string[];
  sortValue: string;
}): JSX.Element {
  return (
    <>
      <DebouncedInput
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <CreditSelectField
        actionType={Actions.FILTER_DIRECTOR}
        dispatch={dispatch}
        label="Director"
        options={distinctDirectors}
      />
      <CreditSelectField
        actionType={Actions.FILTER_PERFORMER}
        dispatch={dispatch}
        label="Performer"
        options={distinctPerformers}
      />
      <CreditSelectField
        actionType={Actions.FILTER_WRITER}
        dispatch={dispatch}
        label="Writer"
        options={distinctWriters}
      />
      <CreditSelectField
        actionType={Actions.FILTER_COLLECTION}
        dispatch={dispatch}
        label="Collection"
        options={distinctCollections}
      />
      <YearInput
        label="Release Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_RELEASE_YEAR, values })
        }
        years={distinctReleaseYears}
      />
      <SelectField
        label="Sort"
        onChange={(e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          })
        }
        value={sortValue}
      >
        <option value="release-date-desc">Release Date (Newest First)</option>
        <option value="release-date-asc">Release Date (Oldest First)</option>
        <option value="title">Title</option>
      </SelectField>
    </>
  );
}

function CreditSelectField({
  actionType,
  dispatch,
  label,
  options,
}: {
  actionType:
    | Actions.FILTER_COLLECTION
    | Actions.FILTER_DIRECTOR
    | Actions.FILTER_PERFORMER
    | Actions.FILTER_WRITER;
  dispatch: React.Dispatch<ActionType>;
  label: string;
  options: readonly string[];
}) {
  return (
    <SelectField
      label={label}
      onChange={(e) =>
        dispatch({
          type: actionType,
          value: e.target.value,
        })
      }
    >
      <SelectOptions options={options} />
    </SelectField>
  );
}
