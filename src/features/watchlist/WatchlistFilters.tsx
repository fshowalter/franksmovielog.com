import { CollectionsFacet } from "~/components/filter-and-sort/facets/collections/CollectionsFacet";
import { DirectorsFacet } from "~/components/filter-and-sort/facets/directors/DirectorsFacet";
import { GenresFacet } from "~/components/filter-and-sort/facets/genres/GenresFacet";
import { PerformersFacet } from "~/components/filter-and-sort/facets/performers/PerformersFacet";
import { ReleaseYearFacet } from "~/components/filter-and-sort/facets/release-year/ReleaseYearFacet";
import { TitleFacet } from "~/components/filter-and-sort/facets/title/TitleFacet";
import { WritersFacet } from "~/components/filter-and-sort/facets/writers/WritersFacet";

import type { WatchlistValue } from "./Watchlist";
import type {
  WatchlistAction,
  WatchlistFiltersValues,
} from "./watchlistReducer";

import { filterWatchlist } from "./filterWatchlist";

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
  return (
    <>
      <TitleFacet defaultValue={filterValues.title} dispatch={dispatch} />
      <ReleaseYearFacet
        defaultValues={filterValues.releaseYear}
        dispatch={dispatch}
        distinctYears={distinctReleaseYears}
      />
      <GenresFacet
        dispatch={dispatch}
        distinctGenres={distinctGenres}
        filterer={filterWatchlist}
        filterValues={filterValues}
        values={values}
      />
      <DirectorsFacet
        dispatch={dispatch}
        distinctDirectors={distinctDirectors}
        filterer={filterWatchlist}
        filterValues={filterValues}
        values={values}
      />
      <PerformersFacet
        dispatch={dispatch}
        distinctPerformers={distinctPerformers}
        filterer={filterWatchlist}
        filterValues={filterValues}
        values={values}
      />
      <WritersFacet
        dispatch={dispatch}
        distinctWriters={distinctWriters}
        filterer={filterWatchlist}
        filterValues={filterValues}
        values={values}
      />
      <CollectionsFacet
        dispatch={dispatch}
        distinctCollections={distinctCollections}
        filterer={filterWatchlist}
        filterValues={filterValues}
        values={values}
      />
    </>
  );
}
