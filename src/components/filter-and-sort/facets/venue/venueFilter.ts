export function createVenueCountMap<
  TValue extends { venue: string | undefined },
>(values: readonly TValue[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value.venue) {
      continue;
    }
    counts.set(value.venue, (counts.get(value.venue) ?? 0) + 1);
  }
  return counts;
}

/**
 * Create a Venue filter function (multi-select OR logic)
 */
export function createVenueFilter<TValue extends { venue: string | undefined }>(
  filterValue?: readonly string[],
) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    value.venue ? filterValue.includes(value.venue) : false;
}
