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

/**
 * Filter controls for the watchlist page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctCollections - Available collections for filtering
 * @param props.distinctDirectors - Available directors for filtering
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctPerformers - Available performers for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctWriters - Available writers for filtering
 * @param props.filterValues - Current active filter values
 * @returns Filter input components for watchlist
 */
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
