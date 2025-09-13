import { selectGroupedReviewedTitleValues } from "~/selectors/selectGroupedReviewedTitleValues";

import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./selectSortedReviewsValues";

export function selectGroupedReviewsValues(
  filteredValues: ReviewsValue[],
  showCount: number,
  sort: ReviewsSort,
) {
  return selectGroupedReviewedTitleValues(filteredValues, showCount, sort);
}
