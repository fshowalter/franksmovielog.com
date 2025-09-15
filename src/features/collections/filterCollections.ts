import { filterCollections as baseFilterCollections } from "~/filterers/filterCollections";

import type { CollectionsValue } from "./Collections";
import type { CollectionsFiltersValues } from "./Collections.reducer";

export function filterCollections(
  sortedValues: CollectionsValue[],
  filterValues: CollectionsFiltersValues,
) {
  return baseFilterCollections(filterValues, sortedValues, []);
}
