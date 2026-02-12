type FilterableMaybeReviewedTitle = {
  slug?: string;
};

/**
 * Creates a filter function for reviewed/unreviewed status.
 * @param filterValues - Filter values (e.g., ["Reviewed"], ["Not Reviewed"], or both)
 * @returns Filter function or undefined if no filter values
 */
export function createReviewedStatusFilter<
  TValue extends FilterableMaybeReviewedTitle,
>(filterValues?: readonly string[]) {
  if (!filterValues || filterValues.length === 0) return;

  // If both "Reviewed" and "Not Reviewed" are selected, show all
  if (filterValues.includes("Reviewed") && filterValues.includes("Not Reviewed")) {
    return;
  }

  return (value: TValue): boolean => {
    if (filterValues.includes("Reviewed")) {
      return !!value.slug;
    }

    return !value.slug;
  };
}
