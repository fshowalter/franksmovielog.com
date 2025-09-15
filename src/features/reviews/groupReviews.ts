import { groupReviewedTitles } from "~/groupers/groupReviewedTitles";

import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./sortReviews";

export function groupReviews(
  filteredValues: ReviewsValue[],
  sort: ReviewsSort,
  showCount: number,
) {
  return groupReviewedTitles(filteredValues, showCount, sort);
}
