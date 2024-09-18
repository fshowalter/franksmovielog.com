import { DebouncedInput } from "src/components/DebouncedInput";
import { SelectField } from "src/components/SelectField";
import { SelectOptions } from "src/components/SelectOptions";
import { YearInput } from "src/components/YearInput";

import { Actions, type ActionType, type Sort } from "./Watchlist.reducer";

export function Filters({
  dispatch,
  sortValue,
  distinctDirectors,
  distinctPerformers,
  distinctWriters,
  distinctCollections,
  distinctReleaseYears,
}: {
  dispatch: React.Dispatch<ActionType>;
  sortValue: string;
  distinctDirectors: readonly string[];
  distinctPerformers: readonly string[];
  distinctWriters: readonly string[];
  distinctCollections: readonly string[];
  distinctReleaseYears: readonly string[];
}): JSX.Element {
  return (
    <>
      <DebouncedInput
        label="Title"
        placeholder="Enter all or part of a title"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_TITLE, value })
        }
      />
      <CreditSelectField
        label="Director"
        dispatch={dispatch}
        actionType={Actions.FILTER_DIRECTOR}
        options={distinctDirectors}
      />
      <CreditSelectField
        label="Performer"
        dispatch={dispatch}
        actionType={Actions.FILTER_PERFORMER}
        options={distinctPerformers}
      />
      <CreditSelectField
        label="Writer"
        dispatch={dispatch}
        actionType={Actions.FILTER_WRITER}
        options={distinctWriters}
      />
      <CreditSelectField
        label="Collection"
        dispatch={dispatch}
        actionType={Actions.FILTER_COLLECTION}
        options={distinctCollections}
      />
      <YearInput
        label="Release Year"
        years={distinctReleaseYears}
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_RELEASE_YEAR, values })
        }
      />
      <SelectField
        value={sortValue}
        label="Order By"
        onChange={(e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          })
        }
      >
        <option value="release-date-desc">Release Date (Newest First)</option>
        <option value="release-date-asc">Release Date (Oldest First)</option>
        <option value="title">Title</option>
      </SelectField>
    </>
  );
}

function CreditSelectField({
  label,
  dispatch,
  actionType,
  options,
}: {
  label: string;
  dispatch: React.Dispatch<ActionType>;
  actionType:
    | Actions.FILTER_COLLECTION
    | Actions.FILTER_DIRECTOR
    | Actions.FILTER_PERFORMER
    | Actions.FILTER_WRITER;
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
