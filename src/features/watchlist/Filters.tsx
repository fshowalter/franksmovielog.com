import { SelectField } from "~/components/fields/SelectField";
import { SelectOptions } from "~/components/fields/SelectOptions";
import { TitleFilters } from "~/components/filter-and-sort/TitleFilters";

import type {
  WatchlistAction,
  WatchlistFiltersValues,
} from "./Watchlist.reducer";

import {
  createGenresFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createTitleFilterChangedAction,
  createWatchlistFilterChangedAction,
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
        genres={{
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
        defaultValue={filterValues.director}
        label="Director"
        onChange={(value) =>
          dispatch(createWatchlistFilterChangedAction("director", value))
        }
        options={distinctDirectors}
      />
      <CreditSelectField
        defaultValue={filterValues.performer}
        label="Performer"
        onChange={(value) =>
          dispatch(createWatchlistFilterChangedAction("performer", value))
        }
        options={distinctPerformers}
      />
      <CreditSelectField
        defaultValue={filterValues.writer}
        label="Writer"
        onChange={(value) =>
          dispatch(createWatchlistFilterChangedAction("writer", value))
        }
        options={distinctWriters}
      />
      <CreditSelectField
        defaultValue={filterValues.collection}
        label="Collection"
        onChange={(value) =>
          dispatch(createWatchlistFilterChangedAction("collection", value))
        }
        options={distinctCollections}
      />
    </>
  );
}

function CreditSelectField({
  defaultValue,
  label,
  onChange,
  options,
}: {
  defaultValue: string | undefined;
  label: string;
  onChange: (value: string) => void;
  options: readonly string[];
}): React.JSX.Element {
  return (
    <SelectField defaultValue={defaultValue} label={label} onChange={onChange}>
      <SelectOptions options={options} />
    </SelectField>
  );
}
