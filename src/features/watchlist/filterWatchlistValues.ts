import { filterTitles } from "~/filterers/filterTitles";

import type { WatchlistValue } from "./Watchlist";
import type { WatchlistFiltersValues } from "./Watchlist.reducer";

/**
 * Filters watchlist titles based on director, performer, writer, collection, and other criteria.
 * @param sortedValues - Array of watchlist titles to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of watchlist titles
 */
export function filterWatchlistValues(
  sortedValues: WatchlistValue[],
  filterValues: WatchlistFiltersValues,
) {
  const extraFilters = [
    createDirectorFilter(filterValues.director),
    createPerformerFilter(filterValues.performer),
    createWriterFilter(filterValues.writer),
    createCollectionFilter(filterValues.collection),
  ].filter((filterFn) => filterFn !== undefined);

  return filterTitles(filterValues, sortedValues, extraFilters);
}

/**
 * Calculates the count of titles for each genre.
 * Used for displaying genre counts in filter UI.
 * Respects all filters EXCEPT genres to show dynamic counts.
 * @param values - Array of watchlist values to count
 * @param currentFilters - Current filter values (to apply other filters when counting)
 * @returns Map of genre to count
 */
export function calculateGenreCounts(
  values: WatchlistValue[],
  currentFilters: WatchlistFiltersValues,
): Map<string, number> {
  // Apply all filters EXCEPT genres to get the base set
  const filtersWithoutGenres: WatchlistFiltersValues = {
    ...currentFilters,
    genres: [],
  };
  const filteredValues = filterWatchlistValues(values, filtersWithoutGenres);

  const counts = new Map<string, number>();
  for (const value of filteredValues) {
    for (const genre of value.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }

  return counts;
}

/**
 * Calculates the count of titles for each director.
 * Used for displaying director counts in filter UI.
 * Respects all filters EXCEPT director to show dynamic counts.
 * @param values - Array of watchlist values to count
 * @param currentFilters - Current filter values (to apply other filters when counting)
 * @returns Map of director name to count
 */
export function calculateDirectorCounts(
  values: WatchlistValue[],
  currentFilters: WatchlistFiltersValues,
): Map<string, number> {
  // Apply all filters EXCEPT director to get the base set
  const filtersWithoutDirector: WatchlistFiltersValues = {
    ...currentFilters,
    director: undefined,
  };
  const filteredValues = filterWatchlistValues(values, filtersWithoutDirector);

  const counts = new Map<string, number>();
  for (const value of filteredValues) {
    for (const director of value.watchlistDirectorNames) {
      counts.set(director, (counts.get(director) ?? 0) + 1);
    }
  }

  return counts;
}

/**
 * Calculates the count of titles for each performer.
 * Used for displaying performer counts in filter UI.
 * Respects all filters EXCEPT performer to show dynamic counts.
 * @param values - Array of watchlist values to count
 * @param currentFilters - Current filter values (to apply other filters when counting)
 * @returns Map of performer name to count
 */
export function calculatePerformerCounts(
  values: WatchlistValue[],
  currentFilters: WatchlistFiltersValues,
): Map<string, number> {
  // Apply all filters EXCEPT performer to get the base set
  const filtersWithoutPerformer: WatchlistFiltersValues = {
    ...currentFilters,
    performer: undefined,
  };
  const filteredValues = filterWatchlistValues(
    values,
    filtersWithoutPerformer,
  );

  const counts = new Map<string, number>();
  for (const value of filteredValues) {
    for (const performer of value.watchlistPerformerNames) {
      counts.set(performer, (counts.get(performer) ?? 0) + 1);
    }
  }

  return counts;
}

/**
 * Calculates the count of titles for each writer.
 * Used for displaying writer counts in filter UI.
 * Respects all filters EXCEPT writer to show dynamic counts.
 * @param values - Array of watchlist values to count
 * @param currentFilters - Current filter values (to apply other filters when counting)
 * @returns Map of writer name to count
 */
export function calculateWriterCounts(
  values: WatchlistValue[],
  currentFilters: WatchlistFiltersValues,
): Map<string, number> {
  // Apply all filters EXCEPT writer to get the base set
  const filtersWithoutWriter: WatchlistFiltersValues = {
    ...currentFilters,
    writer: undefined,
  };
  const filteredValues = filterWatchlistValues(values, filtersWithoutWriter);

  const counts = new Map<string, number>();
  for (const value of filteredValues) {
    for (const writer of value.watchlistWriterNames) {
      counts.set(writer, (counts.get(writer) ?? 0) + 1);
    }
  }

  return counts;
}

/**
 * Calculates the count of titles for each collection.
 * Used for displaying collection counts in filter UI.
 * Respects all filters EXCEPT collection to show dynamic counts.
 * @param values - Array of watchlist values to count
 * @param currentFilters - Current filter values (to apply other filters when counting)
 * @returns Map of collection name to count
 */
export function calculateCollectionCounts(
  values: WatchlistValue[],
  currentFilters: WatchlistFiltersValues,
): Map<string, number> {
  // Apply all filters EXCEPT collection to get the base set
  const filtersWithoutCollection: WatchlistFiltersValues = {
    ...currentFilters,
    collection: undefined,
  };
  const filteredValues = filterWatchlistValues(
    values,
    filtersWithoutCollection,
  );

  const counts = new Map<string, number>();
  for (const value of filteredValues) {
    for (const collection of value.watchlistCollectionNames) {
      counts.set(collection, (counts.get(collection) ?? 0) + 1);
    }
  }

  return counts;
}

function createCollectionFilter(filterValue?: string) {
  if (!filterValue) return;
  return (value: WatchlistValue) => {
    return value.watchlistCollectionNames.includes(filterValue);
  };
}

function createDirectorFilter(filterValue?: string) {
  if (!filterValue) return;
  return (value: WatchlistValue) => {
    return value.watchlistDirectorNames.includes(filterValue);
  };
}

function createPerformerFilter(filterValue?: string) {
  if (!filterValue) return;
  return (value: WatchlistValue) => {
    return value.watchlistPerformerNames.includes(filterValue);
  };
}

function createWriterFilter(filterValue?: string) {
  if (!filterValue) return;
  return (value: WatchlistValue) => {
    return value.watchlistWriterNames.includes(filterValue);
  };
}
