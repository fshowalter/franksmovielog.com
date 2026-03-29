export type FilterableValue = { watchlistCollectionNames: string[] };
type Filters = { collections?: readonly string[] };

export function createCollectionsCountMap<
  TValue extends FilterableValue,
  TFilters extends Filters,
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, collections: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>();
  for (const value of filtered) {
    for (const credit of value.watchlistCollectionNames) {
      counts.set(credit, (counts.get(credit) || 0) + 1);
    }
  }

  return counts;
}

export function createCollectionsFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.collections;
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((name) => value.watchlistCollectionNames.includes(name));
}
