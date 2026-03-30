export type FilterableValue = { watchlistPerformerNames: string[] };
type Filters = { performers?: readonly string[] };

export function createPerformersCountMap<
  TValue extends FilterableValue,
  TFilters extends Filters,
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, performers: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>();
  for (const value of filtered) {
    for (const credit of value.watchlistPerformerNames) {
      counts.set(credit, (counts.get(credit) || 0) + 1);
    }
  }

  return counts;
}

export function createPerformersFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.performers;
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((name) => value.watchlistPerformerNames.includes(name));
}
