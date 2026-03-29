export function createMediumCountMap<
  TValue extends { medium: string | undefined },
>(values: readonly TValue[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value.medium) {
      continue;
    }
    counts.set(value.medium, (counts.get(value.medium) ?? 0) + 1);
  }
  return counts;
}

/**
 * Create a Medium filter function (multi-select OR logic)
 */
export function createMediumFilter<
  TValue extends { medium: string | undefined },
>(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    value.medium ? filterValue.includes(value.medium) : false;
}
