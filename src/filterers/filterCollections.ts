import type { CollectionFiltersValues } from "~/reducers/collectionFiltersReducer";

import { filterSortedValues } from "./filterSortedValues";

export type FilterableCollection = {
  name: string;
};

export function filterCollections<TValue extends FilterableCollection>(
  filterValues: CollectionFiltersValues,
  sortedValues: TValue[],
  extraFilters: ((value: TValue) => boolean)[],
) {
  const filters: ((value: TValue) => boolean)[] = [
    createNameFilter(filterValues.name),
    ...extraFilters,
  ].filter((filterFn) => filterFn !== undefined);

  return filterSortedValues({ filters, sortedValues });
}

function createNameFilter<TValue extends FilterableCollection>(
  filterValue?: string,
) {
  if (!filterValue) return;
  const regex = new RegExp(filterValue, "i");
  return (value: TValue): boolean => regex.test(value.name);
}
