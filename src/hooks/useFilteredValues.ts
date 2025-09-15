import { useState } from "react";

export function useFilteredValues<TValue, TSort, TFilterValues>(
  sorter: (values: TValue[], sort: TSort) => TValue[],
  filterer: (values: TValue[], filterValues: TFilterValues) => TValue[],
  values: TValue[],
  sort: TSort,
  activeFilterValues: TFilterValues,
): TValue[] {
  const [currentSort, setSort] = useState<TSort>();
  const [currentFilterValues, setFilterValues] = useState<TFilterValues>();
  const [filteredValues, setFilteredValues] = useState<TValue[]>([]);

  if (
    Object.is(currentSort, sort) &&
    Object.is(currentFilterValues, activeFilterValues)
  ) {
    return filteredValues;
  }

  setSort(sort);
  setFilterValues(activeFilterValues);

  const sortedValues = sorter(values, sort);
  const newFilteredValues = filterer(sortedValues, activeFilterValues);
  setFilteredValues(newFilteredValues);

  return newFilteredValues;
}
