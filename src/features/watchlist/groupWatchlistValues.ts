import { groupTitleValues } from "~/groupers/groupTitleValues";

import type { WatchlistSort } from "./sortWatchlistValues";
import type { WatchlistValue } from "./WatchlistListItem";

export function groupWatchlistValues(
  filteredValues: WatchlistValue[],
  sort: WatchlistSort,
  showCount: number,
) {
  return groupTitleValues(filteredValues, showCount, sort);
}
