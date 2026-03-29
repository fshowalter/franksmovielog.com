export function createCreditedAsCountMap<
  TValue extends { creditedAs: string[] },
>(values: readonly TValue[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    for (const credit of value.creditedAs) {
      counts.set(credit, (counts.get(credit) ?? 0) + 1);
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
