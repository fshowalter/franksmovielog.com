export function createDirectorsCountMap<
  TValue extends { watchlistDirectorNames: string[] },
>(values: readonly TValue[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    for (const director of value.watchlistDirectorNames) {
      counts.set(director, (counts.get(director) ?? 0) + 1);
    }
  }
  return counts;
}

export function createDirectorsFilter<
  TValue extends { watchlistDirectorNames: string[] },
>(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((name) => value.watchlistDirectorNames.includes(name));
}
