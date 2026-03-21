export function usePaginatedValues<TValue, TSort, TFilterValues>(
  sorter: (values: TValue[], sort: TSort) => TValue[],
  filterer: (values: TValue[], filterValues: TFilterValues) => TValue[],
  values: TValue[],
  sort: TSort,
  activeFilterValues: TFilterValues,
  showCount: number,
): [TValue[], number] {
  "use memo";

  const sortedValues = sorter(values, sort);
  const filteredValues = filterer(sortedValues, activeFilterValues);
  const paginatedValues = filteredValues.slice(0, showCount);

  return [paginatedValues, filteredValues.length];
}
