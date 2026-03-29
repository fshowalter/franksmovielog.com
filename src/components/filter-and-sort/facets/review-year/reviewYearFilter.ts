/**
 * Create a Review Year filter function (range)
 */
export function createReviewYearFilter<
  TValue extends { reviewYear: string | undefined },
>(filterValue?: [string, string]) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return value.reviewYear
      ? value.reviewYear >= filterValue[0] && value.reviewYear <= filterValue[1]
      : false;
  };
}
