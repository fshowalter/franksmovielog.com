import { filterCollections as baseFilterCollections } from "~/filterers/filterCollections";

import type { CollectionsValue } from "./Collections";
import type { CollectionsFiltersValues } from "./Collections.reducer";

/**
 * Filters collections based on name filter criteria.
 * @param sortedValues - Array of collections to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of collections
 */
export function filterCollections(
  sortedValues: CollectionsValue[],
  filterValues: CollectionsFiltersValues,
) {
  return baseFilterCollections(filterValues, sortedValues, []);
}
