import { useState } from "react";

export function useFilteredValues<TValue, TSort, TFilterValues>(
  sorter: (values: TValue[], sort: TSort) => TValue[],
  filterer: (values: TValue[], filterValues: TFilterValues) => TValue[],
  values: TValue[],
  sort: TSort,
  activeFilterValues: TFilterValues,
): [TValue[], number] {
  const [currentSort, setSort] = useState<TSort>();
  const [currentFilterValues, setFilterValues] = useState<TFilterValues>();
  const [filteredValues, setFilteredValues] = useState<TValue[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  if (
    Object.is(currentSort, sort) &&
    Object.is(currentFilterValues, activeFilterValues)
  ) {
    return [filteredValues, totalCount];
  }

  setSort(sort);
  setFilterValues(activeFilterValues);

  const sortedValues = sorter(values, sort);
  setFilteredValues(filterer(sortedValues, activeFilterValues));
  setTotalCount(filteredValues.length);

  return [filteredValues, totalCount];
}
