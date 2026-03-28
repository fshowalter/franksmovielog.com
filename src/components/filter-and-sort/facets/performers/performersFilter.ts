export function createPerformersCountMap<
  TValue extends { watchlistPerformerNames: string[] },
>(values: readonly TValue[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    for (const performer of value.watchlistPerformerNames) {
      counts.set(performer, (counts.get(performer) ?? 0) + 1);
    }
  }
  return counts;
}

export function createPerformersFilter<
  TValue extends { watchlistPerformerNames: string[] },
>(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((name) => value.watchlistPerformerNames.includes(name));
}
