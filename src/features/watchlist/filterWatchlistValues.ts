import { selectFilteredTitles } from "~/selectors/createSelectFilteredTitles";

import type { WatchlistFiltersValues } from "./Watchlist.reducer";
import type { WatchlistValue } from "./WatchlistListItem";

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

  return selectFilteredTitles(filterValues, sortedValues, extraFilters);
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
