import type { RadioListFieldOption } from "~/components/fields/RadioListField";

import { RadioListField } from "~/components/fields/RadioListField";
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

  // Build options with counts for RadioListField
  const directorOptions: RadioListFieldOption[] = [
    { count: values.length, label: "All", value: "All" },
    ...distinctDirectors.map((director) => ({
      count: directorCounts.get(director) ?? 0,
      label: director,
      value: director,
    })),
  ];

  const performerOptions: RadioListFieldOption[] = [
    { count: values.length, label: "All", value: "All" },
    ...distinctPerformers.map((performer) => ({
      count: performerCounts.get(performer) ?? 0,
      label: performer,
      value: performer,
    })),
  ];

  const writerOptions: RadioListFieldOption[] = [
    { count: values.length, label: "All", value: "All" },
    ...distinctWriters.map((writer) => ({
      count: writerCounts.get(writer) ?? 0,
      label: writer,
      value: writer,
    })),
  ];

  const collectionOptions: RadioListFieldOption[] = [
    { count: values.length, label: "All", value: "All" },
    ...distinctCollections.map((collection) => ({
      count: collectionCounts.get(collection) ?? 0,
      label: collection,
      value: collection,
    })),
  ];

  return (
    <>
      <TitleFilters
        genres={{
          counts: genreCounts,
          defaultValues: filterValues.genres,
          onChange: (values) =>
            dispatch(createGenresFilterChangedAction(values)),
          values: distinctGenres,
        }}
        releaseYear={{
          defaultValues: filterValues.releaseYear,
          onChange: (values) =>
            dispatch(createReleaseYearFilterChangedAction(values)),
          values: distinctReleaseYears,
        }}
        title={{
          defaultValue: filterValues.title,
          onChange: (value) => dispatch(createTitleFilterChangedAction(value)),
        }}
      />
      <FilterSection
        defaultOpen={!!filterValues.director}
        title="Director"
      >
        <RadioListField
          defaultValue={filterValues.director ?? "All"}
          label="Director"
          onChange={(value) =>
            dispatch(createWatchlistFilterChangedAction("director", value))
          }
          onClear={() =>
            dispatch(createWatchlistFilterChangedAction("director", "All"))
          }
          options={directorOptions}
        />
      </FilterSection>
      <FilterSection
        defaultOpen={!!filterValues.performer}
        title="Performer"
      >
        <RadioListField
          defaultValue={filterValues.performer ?? "All"}
          label="Performer"
          onChange={(value) =>
            dispatch(createWatchlistFilterChangedAction("performer", value))
          }
          onClear={() =>
            dispatch(createWatchlistFilterChangedAction("performer", "All"))
          }
          options={performerOptions}
        />
      </FilterSection>
      <FilterSection
        defaultOpen={!!filterValues.writer}
        title="Writer"
      >
        <RadioListField
          defaultValue={filterValues.writer ?? "All"}
          label="Writer"
          onChange={(value) =>
            dispatch(createWatchlistFilterChangedAction("writer", value))
          }
          onClear={() =>
            dispatch(createWatchlistFilterChangedAction("writer", "All"))
          }
          options={writerOptions}
        />
      </FilterSection>
      <FilterSection
        defaultOpen={!!filterValues.collection}
        title="Collection"
      >
        <RadioListField
          defaultValue={filterValues.collection ?? "All"}
          label="Collection"
          onChange={(value) =>
            dispatch(createWatchlistFilterChangedAction("collection", value))
          }
          onClear={() =>
            dispatch(createWatchlistFilterChangedAction("collection", "All"))
          }
          options={collectionOptions}
        />
      </FilterSection>
    </>
  );
}
