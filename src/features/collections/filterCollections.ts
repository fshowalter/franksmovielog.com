import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createNameFilter } from "~/components/filter-and-sort/facets/name/nameFilter";

import type { CollectionsValue } from "./Collections";
import type { CollectionsFiltersValues } from "./Collections.reducer";

export function filterCollections(
  sortedValues: CollectionsValue[],
  filterValues: CollectionsFiltersValues,
) {
  const filters = [createNameFilter(filterValues.name)].filter(
    (f) => f !== undefined,
  );
  return filterSortedValues({ filters, sortedValues });
}
