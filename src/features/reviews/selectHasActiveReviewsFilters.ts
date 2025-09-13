import type { WatchlistFiltersValues } from "./Watchlist.reducer";

export function selectHasActiveWatchlistFilters(
  pendingFilterValues: WatchlistFiltersValues,
): boolean {
  return Object.keys(pendingFilterValues).length > 0;
}
