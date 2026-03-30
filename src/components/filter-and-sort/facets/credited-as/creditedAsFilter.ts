export type FilterableValue = { creditedAs: string[] };
type Filters = { creditedAs?: readonly string[] };

export function createCreditedAsCountMap<
  TValue extends FilterableValue,
  TFilters extends Filters,
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, creditedAs: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>();
  for (const value of filtered) {
    for (const credit of value.creditedAs) {
      counts.set(credit, (counts.get(credit) || 0) + 1);
    }
  }

  return counts;
}

export function createCreditedAsFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.creditedAs;
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((credit) => value.creditedAs.includes(credit));
}
