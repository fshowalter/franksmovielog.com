import type { CheckboxListFieldOption } from "~/components/fields/CheckboxListField";

import { CheckboxListField } from "~/components/fields/CheckboxListField";
import { FilterSection } from "~/components/filter-and-sort/FilterSection";
import { TitleFilters } from "~/components/filter-and-sort/TitleFilters";

import type { WatchlistValue } from "./Watchlist";
import type {
  WatchlistAction,
  WatchlistFiltersValues,
} from "./Watchlist.reducer";

import {
  calculateCollectionCounts,
  calculateDirectorCounts,
  calculateGenreCounts,
  calculatePerformerCounts,
  calculateWriterCounts,
} from "./filterWatchlistValues";
import {
  createGenresFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createRemoveAppliedFilterAction,
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
 * @param props.values - All watchlist values (for count calculation)
 * @returns Filter input components for watchlist
 */
export function WatchlistFilters({
  dispatch,
  distinctCollections,
  distinctDirectors,
  distinctGenres,
  distinctPerformers,
  distinctReleaseYears,
  distinctWriters,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<WatchlistAction>;
  distinctCollections: readonly string[];
  distinctDirectors: readonly string[];
  distinctGenres: readonly string[];
  distinctPerformers: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctWriters: readonly string[];
  filterValues: WatchlistFiltersValues;
  values: readonly WatchlistValue[];
}): React.JSX.Element {
  // Calculate dynamic counts for each filter
  const genreCounts = calculateGenreCounts([...values], filterValues);
  const directorCounts = calculateDirectorCounts([...values], filterValues);
  const performerCounts = calculatePerformerCounts([...values], filterValues);
  const writerCounts = calculateWriterCounts([...values], filterValues);
  const collectionCounts = calculateCollectionCounts([...values], filterValues);

  // Build options with counts for CheckboxListField
  const directorOptions: CheckboxListFieldOption[] = distinctDirectors.map(
    (director) => ({
      count: directorCounts.get(director) ?? 0,
      label: director,
      value: director,
    }),
  );

  const performerOptions: CheckboxListFieldOption[] = distinctPerformers.map(
    (performer) => ({
      count: performerCounts.get(performer) ?? 0,
      label: performer,
      value: performer,
    }),
  );

  const writerOptions: CheckboxListFieldOption[] = distinctWriters.map(
    (writer) => ({
      count: writerCounts.get(writer) ?? 0,
      label: writer,
      value: writer,
    }),
  );

  const collectionOptions: CheckboxListFieldOption[] = distinctCollections.map(
    (collection) => ({
      count: collectionCounts.get(collection) ?? 0,
      label: collection,
      value: collection,
    }),
  );

  return (
    <>
      <TitleFilters
        genres={{
          counts: genreCounts,
          defaultValues: filterValues.genres,
          onChange: (values) =>
            dispatch(createGenresFilterChangedAction(values)),
          onClear: () => dispatch(createRemoveAppliedFilterAction("genres")),
          values: distinctGenres,
        }}
        releaseYear={{
          defaultValues: filterValues.releaseYear,
          onChange: (values) =>
            dispatch(createReleaseYearFilterChangedAction(values)),
          onClear: () =>
            dispatch(createRemoveAppliedFilterAction("releaseYear")),
          values: distinctReleaseYears,
        }}
        title={{
          defaultValue: filterValues.title,
          onChange: (value) => dispatch(createTitleFilterChangedAction(value)),
        }}
      />
      <FilterSection title="Director">
        <CheckboxListField
          defaultValues={filterValues.director}
          label="Director"
          onChange={(values) =>
            dispatch(createWatchlistFilterChangedAction("director", values))
          }
          onClear={() =>
            dispatch(createWatchlistFilterChangedAction("director", []))
          }
          options={directorOptions}
        />
      </FilterSection>
      <FilterSection title="Performer">
        <CheckboxListField
          defaultValues={filterValues.performer}
          label="Performer"
          onChange={(values) =>
            dispatch(createWatchlistFilterChangedAction("performer", values))
          }
          onClear={() =>
            dispatch(createWatchlistFilterChangedAction("performer", []))
          }
          options={performerOptions}
        />
      </FilterSection>
      <FilterSection title="Writer">
        <CheckboxListField
          defaultValues={filterValues.writer}
          label="Writer"
          onChange={(values) =>
            dispatch(createWatchlistFilterChangedAction("writer", values))
          }
          onClear={() =>
            dispatch(createWatchlistFilterChangedAction("writer", []))
          }
          options={writerOptions}
        />
      </FilterSection>
      <FilterSection title="Collection">
        <CheckboxListField
          defaultValues={filterValues.collection}
          label="Collection"
          onChange={(values) =>
            dispatch(createWatchlistFilterChangedAction("collection", values))
          }
          onClear={() =>
            dispatch(createWatchlistFilterChangedAction("collection", []))
          }
          options={collectionOptions}
        />
      </FilterSection>
    </>
  );
}
