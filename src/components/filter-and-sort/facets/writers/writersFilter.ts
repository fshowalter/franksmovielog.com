export type FilterableValue = { watchlistWriterNames: string[] };
type Filters = { writers?: readonly string[] };

export function createWritersCountMap<
  TValue extends FilterableValue,
  TFilters extends Filters,
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, writers: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>();
  for (const value of filtered) {
    for (const credit of value.watchlistWriterNames) {
      counts.set(credit, (counts.get(credit) || 0) + 1);
    }
  }

  return counts;
}

export function createWritersFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.writers;
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((name) => value.watchlistWriterNames.includes(name));
}
