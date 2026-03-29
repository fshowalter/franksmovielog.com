import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createGenresFilter } from "~/components/filter-and-sort/facets/genres/genresFilter";
import { createGradeFilter } from "~/components/filter-and-sort/facets/grade/gradeFilter";
import { createReleaseYearFilter } from "~/components/filter-and-sort/facets/release-year/releaseYearFilter";
import { createReviewYearFilter } from "~/components/filter-and-sort/facets/review-year/reviewYearFilter";
import { createTitleFilter } from "~/components/filter-and-sort/facets/title/titleFilter";

import type { ReviewsValue } from "./ReviewsListItem";
import type { ReviewsFiltersValues } from "./reviewsReducer";

/**
 * Filters reviews based on grade, genre, release year, and other criteria.
 * @param sortedValues - Array of reviews to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of reviews
 */
export function filterReviews(
  sortedValues: readonly ReviewsValue[],
  filterValues: ReviewsFiltersValues,
) {
  const filters = [
    createTitleFilter(filterValues),
    createReleaseYearFilter(filterValues),
    createGenresFilter(filterValues),
    createGradeFilter(filterValues),
    createReviewYearFilter(filterValues),
  ].filter((f) => f !== undefined);

  return filterSortedValues({ filters, sortedValues });
}
