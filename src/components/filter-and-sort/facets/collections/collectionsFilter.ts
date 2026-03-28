export function createCollectionsCountMap<
  TValue extends { watchlistCollectionNames: string[] },
>(values: readonly TValue[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    for (const name of value.watchlistCollectionNames) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return counts;
}

export function createCollectionsFilter<
  TValue extends { watchlistCollectionNames: string[] },
>(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((name) => value.watchlistCollectionNames.includes(name));
}
