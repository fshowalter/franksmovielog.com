import { SelectField } from "~/components/fields/SelectField";
import { SelectOptions } from "~/components/fields/SelectOptions";
import { TitleFilters } from "~/components/filter-and-sort/TitleFilters";

import type {
  WatchlistAction,
  WatchlistFiltersValues,
} from "./Watchlist.reducer";

import {
  createCollectionFilterChangedAction,
  createDirectorFilterChangedAction,
  createGenresFilterChangedAction,
  createPerformerFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createTitleFilterChangedAction,
  createWriterFilterChangedAction,
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
  dispatch: React.Dispatch<WatchlistAction>;
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
          onChange: (values) =>
            dispatch(createGenresFilterChangedAction(values)),
          values: distinctGenres,
        }}
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
      <CreditSelectField
        initialValue={filterValues.director}
        label="Director"
        onChange={(value) => dispatch(createDirectorFilterChangedAction(value))}
        options={distinctDirectors}
      />
      <CreditSelectField
        initialValue={filterValues.performer}
        label="Performer"
        onChange={(value) =>
          dispatch(createPerformerFilterChangedAction(value))
        }
        options={distinctPerformers}
      />
      <CreditSelectField
        initialValue={filterValues.writer}
        label="Writer"
        onChange={(value) => dispatch(createWriterFilterChangedAction(value))}
        options={distinctWriters}
      />
      <CreditSelectField
        initialValue={filterValues.collection}
        label="Collection"
        onChange={(value) =>
          dispatch(createCollectionFilterChangedAction(value))
        }
        options={distinctCollections}
      />
    </>
  );
}

function CreditSelectField({
  initialValue,
  label,
  onChange,
  options,
}: {
  initialValue: string | undefined;
  label: string;
  onChange: (value: string) => void;
  options: readonly string[];
}): React.JSX.Element {
  return (
    <SelectField initialValue={initialValue} label={label} onChange={onChange}>
      <SelectOptions options={options} />
    </SelectField>
  );
}
