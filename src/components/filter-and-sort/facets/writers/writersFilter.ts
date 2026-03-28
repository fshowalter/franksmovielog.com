export function createWritersCountMap<
  TValue extends { watchlistWriterNames: string[] },
>(values: readonly TValue[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    for (const writer of value.watchlistWriterNames) {
      counts.set(writer, (counts.get(writer) ?? 0) + 1);
    }
  }
  return counts;
}

export function createWritersFilter<
  TValue extends { watchlistWriterNames: string[] },
>(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((name) => value.watchlistWriterNames.includes(name));
}
