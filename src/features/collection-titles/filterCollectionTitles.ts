import { filterMaybeReviewedTitles } from "~/filterers/filterMaybeReviewedTitles";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesFiltersValues } from "./CollectionTitles.reducer";

/**
 * Filters collection titles based on review status, genre, and other criteria.
 * @param sortedValues - Array of collection titles to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of collection titles
 */
export function filterCollectionTitles(
  sortedValues: CollectionTitlesValue[],
  filterValues: CollectionTitlesFiltersValues,
) {
  return filterMaybeReviewedTitles(filterValues, sortedValues, []);
}
