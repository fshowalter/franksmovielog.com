import { groupReviewedTitleValues } from "~/groupers/groupReviewedTitleValues";

import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./sortReviewsValues";

export function groupReviewsValues(
  filteredValues: ReviewsValue[],
  sort: ReviewsSort,
  showCount: number,
) {
  return groupReviewedTitleValues(filteredValues, showCount, sort);
}
