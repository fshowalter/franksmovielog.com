import { useState } from "react";

export function useGroupedValues<TValue, TSort, TFilterValues>(
  sorter: (values: TValue[], sort: TSort) => TValue[],
  filterer: (values: TValue[], filterValues: TFilterValues) => TValue[],
  grouper: (values: TValue[], sort: TSort) => Map<string, TValue[]>,
  values: TValue[],
  sort: TSort,
  activeFilterValues: TFilterValues,
): [Map<string, TValue[]>, number] {
  const [currentSort, setSort] = useState<TSort>();
  const [currentFilterValues, setFilterValues] = useState<TFilterValues>();
  const [groupedValues, setGroupedValues] = useState<Map<string, TValue[]>>(
    new Map<string, TValue[]>(),
  );
  const [totalCount, setTotalCount] = useState<number>(0);

  if (
    Object.is(currentSort, sort) &&
    Object.is(currentFilterValues, activeFilterValues)
  ) {
    return [groupedValues, totalCount];
  }

  setSort(sort);
  setFilterValues(activeFilterValues);

  const sortedValues = sorter(values, sort);
  const filteredValues = filterer(sortedValues, activeFilterValues);
  const newGroupedValues = grouper(filteredValues, sort);
  setGroupedValues(newGroupedValues);
  setTotalCount(filteredValues.length);

  return [newGroupedValues, filteredValues.length];
}
