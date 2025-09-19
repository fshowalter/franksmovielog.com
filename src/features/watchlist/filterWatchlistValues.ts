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
