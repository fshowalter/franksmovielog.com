import { groupTitles } from "~/groupers/groupTitles";

import type { WatchlistSort } from "./sortWatchlistValues";
import type { WatchlistValue } from "./Watchlist";

/**
 * Groups watchlist titles based on the current sort criteria.
 * @param filteredValues - Array of filtered watchlist titles
 * @param sort - Current sort criteria
 * @param showCount - Number of items to show
 * @returns Grouped watchlist titles
 */
export function groupWatchlistValues(
  filteredValues: WatchlistValue[],
  sort: WatchlistSort,
  showCount: number,
) {
  return groupTitles(filteredValues, sort, undefined, showCount);
}
