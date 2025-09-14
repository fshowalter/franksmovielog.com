import { filterReviewedTitles } from "~/filterers/filterReviewedTitles";

import type { ReviewsFiltersValues } from "./reducer";
import type { ReviewsValue } from "./ReviewsListItem";

export function filterReviewsValues(
  sortedValues: ReviewsValue[],
  filterValues: ReviewsFiltersValues,
) {
  return filterReviewedTitles(filterValues, sortedValues, []);
}
