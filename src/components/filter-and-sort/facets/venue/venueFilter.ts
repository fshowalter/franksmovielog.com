export type FilterableValue = { venue?: string };
type Filters = { venue?: readonly string[] };

export function createVenueCountMap<
  TValue extends FilterableValue,
  TFilters extends Filters,
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, venue: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>();
  for (const value of filtered) {
    if (!value.venue) {
      continue;
    }
    counts.set(value.venue, (counts.get(value.venue) ?? 0) + 1);
  }

  return counts;
}

export function createVenueFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.venue;
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    value.venue ? filterValue.includes(value.venue) : false;
}
