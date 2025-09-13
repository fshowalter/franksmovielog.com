import {
  createSelectSortedReviewedTitles,
  type ReviewedTitleSort,
} from "~/selectors/createSelectSortedReviewedTitles";

import type { ReviewsValue } from "./ReviewsListItem";

export type ReviewsSort = ReviewedTitleSort;

export const selectSortedReviewsValues = createSelectSortedReviewedTitles<
  ReviewsValue,
  ReviewsSort
>();
