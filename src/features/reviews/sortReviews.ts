import type { ReviewedTitleSort } from "~/sorters/createReviewedTitleSorter";

import { createReviewedTitleSorter } from "~/sorters/createReviewedTitleSorter";

import type { ReviewsValue } from "./ReviewsListItem";

/**
 * Sort type for reviews.
 */
export type ReviewsSort = ReviewedTitleSort;

/**
 * Sorter function for reviews, supporting title, grade, review date, and release date sorting.
 */
export const sortReviews = createReviewedTitleSorter<
  ReviewsValue,
  ReviewsSort
>();
