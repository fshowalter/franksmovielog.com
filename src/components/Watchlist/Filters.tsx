import type { JSX } from "react";

import { MultiSelectField } from "~/components/MultiSelectField";
import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./Watchlist.reducer";

import { Actions } from "./Watchlist.reducer";

type FilterValues = {
  collection?: string;
  director?: string;
  genres?: readonly string[];
  performer?: string;
  releaseYear?: [string, string];
  title?: string;
  writer?: string;
};

export function Filters({
  dispatch,
  distinctCollections,
  distinctDirectors,
  distinctGenres,
  distinctPerformers,
  distinctReleaseYears,
  distinctWriters,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctCollections: readonly string[];
  distinctDirectors: readonly string[];
  distinctGenres: readonly string[];
  distinctPerformers: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctWriters: readonly string[];
  filterValues: FilterValues;
}): JSX.Element {
  return (
    <>
      <TextFilter
        initialValue={filterValues.title || ""}
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <CreditSelectField
        actionType={Actions.PENDING_FILTER_DIRECTOR}
        dispatch={dispatch}
        initialValue={filterValues.director || "All"}
        label="Director"
        options={distinctDirectors}
      />
      <CreditSelectField
        actionType={Actions.PENDING_FILTER_PERFORMER}
        dispatch={dispatch}
        initialValue={filterValues.performer || "All"}
        label="Performer"
        options={distinctPerformers}
      />
      <CreditSelectField
        actionType={Actions.PENDING_FILTER_WRITER}
        dispatch={dispatch}
        initialValue={filterValues.writer || "All"}
        label="Writer"
        options={distinctWriters}
      />
      <CreditSelectField
        actionType={Actions.PENDING_FILTER_COLLECTION}
        dispatch={dispatch}
        initialValue={filterValues.collection || "All"}
        label="Collection"
        options={distinctCollections}
      />
      <YearInput
        initialValues={filterValues.releaseYear || []}
        label="Release Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_RELEASE_YEAR, values })
        }
        years={distinctReleaseYears}
      />
      <MultiSelectField
        initialValues={filterValues.genres}
        label="Genres"
        onChange={(values) =>
          dispatch({
            type: Actions.PENDING_FILTER_GENRES,
            values,
          })
        }
        options={distinctGenres}
      />
    </>
  );
}

export function SortOptions() {
  return (
    <>
      <option value="release-date-desc">Release Date (Newest First)</option>
      <option value="release-date-asc">Release Date (Oldest First)</option>
      <option value="title-asc">Title (A &rarr; Z)</option>
      <option value="title-desc">Title (Z &rarr; A)</option>
    </>
  );
}

function CreditSelectField({
  actionType,
  dispatch,
  initialValue,
  label,
  options,
}: {
  actionType:
    | typeof Actions.PENDING_FILTER_COLLECTION
    | typeof Actions.PENDING_FILTER_DIRECTOR
    | typeof Actions.PENDING_FILTER_PERFORMER
    | typeof Actions.PENDING_FILTER_WRITER;
  dispatch: React.Dispatch<ActionType>;
  initialValue: string;
  label: string;
  options: readonly string[];
}) {
  return (
    <SelectField
      initialValue={initialValue}
      label={label}
      onChange={(value) =>
        dispatch({
          type: actionType,
          value,
        })
      }
    >
      <SelectOptions options={options} />
    </SelectField>
  );
}
