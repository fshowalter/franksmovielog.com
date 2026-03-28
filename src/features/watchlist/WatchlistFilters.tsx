import type { CheckboxListFieldOption } from "~/components/fields/CheckboxListField";

import { AnimatedDetailsDisclosure } from "~/components/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/fields/CheckboxListField";
import { TextField } from "~/components/fields/TextField";
import { YearField } from "~/components/fields/YearField";

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
  createCollectionFilterChangedAction,
  createDirectorFilterChangedAction,
  createGenresFilterChangedAction,
  createPerformerFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createRemoveAppliedFilterAction,
  createTitleFilterChangedAction,
  createWriterFilterChangedAction,
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
      <TextField
        defaultValue={filterValues.title}
        label="Title"
        onInputChange={(value) => dispatch(createTitleFilterChangedAction(value))}
        placeholder="Enter all or part of a title"
      />
      <YearField
        defaultValues={filterValues.releaseYear}
        label="Release Year"
        onClear={() => dispatch(createRemoveAppliedFilterAction("releaseYear"))}
        onYearChange={(values) =>
          dispatch(createReleaseYearFilterChangedAction(values))
        }
        years={distinctReleaseYears}
      />
      <AnimatedDetailsDisclosure title="Genres">
        <CheckboxListField
          defaultValues={filterValues.genres}
          label="Genres"
          onChange={(values) => dispatch(createGenresFilterChangedAction(values))}
          onClear={() => dispatch(createRemoveAppliedFilterAction("genres"))}
          options={distinctGenres.map((value) => ({
            count: genreCounts.get(value) ?? 0,
            label: value,
            value,
          }))}
        />
      </AnimatedDetailsDisclosure>
      <AnimatedDetailsDisclosure title="Director">
        <CheckboxListField
          defaultValues={filterValues.director}
          label="Director"
          onChange={(values) =>
            dispatch(createDirectorFilterChangedAction(values))
          }
          onClear={() => dispatch(createDirectorFilterChangedAction([]))}
          options={directorOptions}
        />
      </AnimatedDetailsDisclosure>
      <AnimatedDetailsDisclosure title="Performer">
        <CheckboxListField
          defaultValues={filterValues.performer}
          label="Performer"
          onChange={(values) =>
            dispatch(createPerformerFilterChangedAction(values))
          }
          onClear={() => dispatch(createPerformerFilterChangedAction([]))}
          options={performerOptions}
        />
      </AnimatedDetailsDisclosure>
      <AnimatedDetailsDisclosure title="Writer">
        <CheckboxListField
          defaultValues={filterValues.writer}
          label="Writer"
          onChange={(values) =>
            dispatch(createWriterFilterChangedAction(values))
          }
          onClear={() => dispatch(createWriterFilterChangedAction([]))}
          options={writerOptions}
        />
      </AnimatedDetailsDisclosure>
      <AnimatedDetailsDisclosure title="Collection">
        <CheckboxListField
          defaultValues={filterValues.collection}
          label="Collection"
          onChange={(values) =>
            dispatch(createCollectionFilterChangedAction(values))
          }
          onClear={() => dispatch(createCollectionFilterChangedAction([]))}
          options={collectionOptions}
        />
      </AnimatedDetailsDisclosure>
    </>
  );
}
