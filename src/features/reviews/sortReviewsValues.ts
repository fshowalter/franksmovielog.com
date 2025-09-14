import type { ReviewedTitleSort } from "~/sorters/createReviewedTitleSorter";

import { createReviewedTitleSorter } from "~/sorters/createReviewedTitleSorter";

import type { ReviewsValue } from "./ReviewsListItem";

export type ReviewsSort = ReviewedTitleSort;

export const sortReviewsValues = createReviewedTitleSorter<
  ReviewsValue,
  ReviewsSort
>();
