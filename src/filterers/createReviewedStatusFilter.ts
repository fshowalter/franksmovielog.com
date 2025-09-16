type FilterableMaybeReviewedTitle = {
  slug?: string;
};

export function createReviewedStatusFilter<
  TValue extends FilterableMaybeReviewedTitle,
>(filterValue?: string) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    if (filterValue === "Reviewed") {
      return !!value.slug;
    }

    return !value.slug;
  };
}
