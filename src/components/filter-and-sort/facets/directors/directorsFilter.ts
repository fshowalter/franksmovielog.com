export type FilterableValue = { watchlistDirectorNames: string[] };
type Filters = { directors?: readonly string[] };

export function createDirectorsCountMap<
  TValue extends FilterableValue,
  TFilters extends Filters,
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, directors: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>();
  for (const value of filtered) {
    for (const credit of value.watchlistDirectorNames) {
      counts.set(credit, (counts.get(credit) || 0) + 1);
    }
  }

  return counts;
}

export function createDirectorsFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.directors;
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((name) => value.watchlistDirectorNames.includes(name));
}
