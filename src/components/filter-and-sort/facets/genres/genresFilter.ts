export type FilterableValue = { genres: string[] };
type Filters = { genres?: readonly string[] };

export function createGenresCountMap<
  TValue extends FilterableValue,
  TFilters extends Filters,
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, genres: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>();
  for (const value of filtered) {
    for (const genre of value.genres) {
      counts.set(genre, (counts.get(genre) || 0) + 1);
    }
  }

  return counts;
}

export function createGenresFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.genres;
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((name) => value.genres.includes(name));
}
