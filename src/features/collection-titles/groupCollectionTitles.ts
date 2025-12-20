import { groupMaybeReviewedTitles } from "~/groupers/groupMaybeReviewedTitles";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesSort } from "./sortCollectionTitles";

/**
 * Groups collection titles based on the current sort criteria.
 * @param filteredValues - Array of filtered collection titles
 * @param sort - Current sort criteria
 * @param showCount - Number of items to show
 * @returns Grouped collection titles
 */
export function groupCollectionTitles(
  filteredValues: CollectionTitlesValue[],
  sort: CollectionTitlesSort,
) {
  return groupMaybeReviewedTitles(filteredValues, sort);
}
