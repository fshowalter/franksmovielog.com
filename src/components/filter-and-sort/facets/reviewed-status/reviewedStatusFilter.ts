export type FilterableValue = {
  reviewSlug?: string;
};

type Filters = { reviewedStatus?: readonly string[] };

/**
 * Counts items by reviewed status ("Reviewed", "Not Reviewed", "Abandoned").
 * Uses the same classification logic as createReviewedStatusFilter.
 * @param values - Array of items to count
 * @returns Map from status string to item count
 */
export function createReviewedStatusCountMap<
  TValue extends FilterableValue,
  TFilters extends Filters,
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, reviewedStatus: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>([
    ["Not Reviewed", 0],
    ["Reviewed", 0],
  ]);
  for (const value of filtered) {
    const status = getStatus(value);
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }
  return counts;
}

/**
 * Creates a filter function for reviewed/unreviewed/abandoned status (multi-select OR).
 * @param filterValue - Array of status strings to match
 * @returns Filter function or undefined if no filter value
 */
export function createReviewedStatusFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.reviewedStatus;

  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue): boolean => {
    return filterValue.includes(getStatus(value));
  };
}

function getStatus(value: FilterableValue): string {
  return value.reviewSlug ? "Reviewed" : "Not Reviewed";
}
