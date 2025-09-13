import { selectFilteredReviewedTitles } from "~/selectors/createSelectFilteredReviewedTitles";

import type { ReviewsFiltersValues } from "./reducer";
import type { ReviewsValue } from "./ReviewsListItem";

export function selectFilteredReviewsValues(
  filterValues: ReviewsFiltersValues,
  sortedValues: ReviewsValue[],
) {
  return selectFilteredReviewedTitles(filterValues, sortedValues, []);
}
