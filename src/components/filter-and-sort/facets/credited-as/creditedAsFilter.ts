export function createCreditedAsCountMap<
  TValue extends { creditedAs: string[] },
  TFilters extends { creditedAs?: readonly string[] },
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT creditedAs
  const filtersWithoutCreditedAs = { ...filters, creditedAs: undefined };
  const filtered = filterer(values, filtersWithoutCreditedAs);

  // Count occurrences of each credit role
  const counts = new Map<string, number>();
  for (const value of filtered) {
    for (const credit of value.creditedAs) {
      counts.set(credit, (counts.get(credit) || 0) + 1);
    }
  }

  return counts;
}

export function createCreditedAsFilter<TValue extends { creditedAs: string[] }>(
  filterValue?: readonly string[],
) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((credit) => value.creditedAs.includes(credit));
}
