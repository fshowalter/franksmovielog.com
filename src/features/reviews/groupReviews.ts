import { groupReviewedTitles } from "~/groupers/groupReviewedTitles";

import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./sortReviews";

/**
 * Groups reviews based on the current sort criteria.
 * @param filteredValues - Array of filtered reviews
 * @param sort - Current sort criteria
 * @param showCount - Number of items to show
 * @returns Grouped reviews
 */
export function groupReviews(
  filteredValues: ReviewsValue[],
  sort: ReviewsSort,
  showCount: number,
) {
  return groupReviewedTitles(filteredValues, showCount, sort);
}
