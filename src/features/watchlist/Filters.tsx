import { SelectField } from "~/components/fields/SelectField";
import { SelectOptions } from "~/components/fields/SelectOptions";
import { TitleFilters } from "~/components/filter-and-sort/TitleFilters";

import {
  createGenresUpdatedAction,
  createReleaseYearUpdatedAction,
  createTitleUpdatedAction,
  type WatchlistAction,
  type WatchlistFiltersValues,
} from "./Watchlist.reducer";

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
  filterValues: WatchlistFiltersValues;
}): React.JSX.Element {
  return (
    <>
      <TitleFilters
        genre={{
          initialValue: filterValues.genres,
          onChange: (values) => dispatch(createGenresUpdatedAction(values)),
          values: distinctGenres,
        }}
        releaseYear={{
          initialValue: filterValues.releaseYear,
          onChange: (values) =>
            dispatch(createReleaseYearUpdatedAction(values)),
          values: distinctReleaseYears,
        }}
        title={{
          initialValue: filterValues.title,
          onChange: (value) => dispatch(createTitleUpdatedAction(value)),
        }}
      />
      <CreditSelectField
        actionType={Actions.PENDING_FILTER_DIRECTOR}
        dispatch={dispatch}
        initialValue={filterValues.director}
        label="Director"
        options={distinctDirectors}
      />
      <CreditSelectField
        actionType={Actions.PENDING_FILTER_PERFORMER}
        dispatch={dispatch}
        initialValue={filterValues.performer}
        label="Performer"
        options={distinctPerformers}
      />
      <CreditSelectField
        actionType={Actions.PENDING_FILTER_WRITER}
        dispatch={dispatch}
        initialValue={filterValues.writer}
        label="Writer"
        options={distinctWriters}
      />
      <CreditSelectField
        actionType={Actions.PENDING_FILTER_COLLECTION}
        dispatch={dispatch}
        initialValue={filterValues.collection}
        label="Collection"
        options={distinctCollections}
      />
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
  initialValue: string | undefined;
  label: string;
  options: readonly string[];
}): React.JSX.Element {
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
