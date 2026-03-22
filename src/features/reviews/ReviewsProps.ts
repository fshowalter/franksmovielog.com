import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsSort } from "./sortReviews";

export type ReviewsProps = {
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: ReviewsSort;
  values: ReviewsValue[];
};
