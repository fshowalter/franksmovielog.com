import { filterReviewedTitles } from "~/filterers/filterReviewedTitles";

import type { ReviewsFiltersValues } from "./reducer";
import type { ReviewsValue } from "./ReviewsListItem";

/**
 * Calculates how many reviews match each genre, considering current filter state.
 * Used for displaying dynamic counts in genre filter options.
 * @param reviews - Array of reviews to count
 * @param currentFilters - Current filter values (to apply other filters when counting)
 * @returns Map of genre name to count of matching reviews
 */
export function calculateGenreCounts(
  reviews: ReviewsValue[],
  currentFilters: ReviewsFiltersValues,
): Map<string, number> {
  // Apply all filters EXCEPT genres to get the base set
  const filtersWithoutGenres: ReviewsFiltersValues = {
    ...currentFilters,
    genres: undefined,
  };
  const filteredReviews = filterReviews(reviews, filtersWithoutGenres);

  // Count occurrences of each genre in the filtered set
  const counts = new Map<string, number>();
  for (const review of filteredReviews) {
    for (const genre of review.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }

  return counts;
}

/**
 * Calculates the distribution of grades.
 * Used for displaying grade range information in grade filter.
 * @param reviews - Array of reviews to analyze
 * @param currentFilters - Current filter values (to apply other filters when counting)
 * @returns Object containing min grade, max grade, and count per grade value
 */
export function calculateGradeCounts(
  reviews: ReviewsValue[],
  currentFilters: ReviewsFiltersValues,
): { gradeCounts: Map<number, number>; max: number; min: number } {
  // Apply all filters EXCEPT gradeValue to get the base set
  const filtersWithoutGrade: ReviewsFiltersValues = {
    ...currentFilters,
    gradeValue: undefined,
  };
  const filteredReviews = filterReviews(reviews, filtersWithoutGrade);

  if (filteredReviews.length === 0) {
    return { gradeCounts: new Map(), max: 0, min: 0 };
  }

  // Calculate range and counts
  const gradeCounts = new Map<number, number>();
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const review of filteredReviews) {
    const grade = review.gradeValue;
    min = Math.min(min, grade);
    max = Math.max(max, grade);
    gradeCounts.set(grade, (gradeCounts.get(grade) ?? 0) + 1);
  }

  return {
    gradeCounts,
    max: max === Number.NEGATIVE_INFINITY ? 0 : max,
    min: min === Number.POSITIVE_INFINITY ? 0 : min,
  };
}

/**
 * Calculates the range and distribution of release years.
 * Used for displaying year range information in release year filter.
 * @param reviews - Array of reviews to analyze
 * @param currentFilters - Current filter values (to apply other filters when counting)
 * @returns Object containing min year, max year, and count per year
 */
export function calculateReleaseYearCounts(
  reviews: ReviewsValue[],
  currentFilters: ReviewsFiltersValues,
): { max: number; min: number; yearCounts: Map<number, number> } {
  // Apply all filters EXCEPT releaseYear to get the base set
  const filtersWithoutReleaseYear: ReviewsFiltersValues = {
    ...currentFilters,
    releaseYear: undefined,
  };
  const filteredReviews = filterReviews(reviews, filtersWithoutReleaseYear);

  if (filteredReviews.length === 0) {
    return { max: 0, min: 0, yearCounts: new Map() };
  }

  // Calculate range and counts
  const yearCounts = new Map<number, number>();
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const review of filteredReviews) {
    const year = Number.parseInt(review.releaseYear, 10);
    if (!Number.isNaN(year)) {
      min = Math.min(min, year);
      max = Math.max(max, year);
      yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
    }
  }

  return {
    max: max === Number.NEGATIVE_INFINITY ? 0 : max,
    min: min === Number.POSITIVE_INFINITY ? 0 : min,
    yearCounts,
  };
}

/**
 * Calculates the range and distribution of review years.
 * Used for displaying year range information in review year filter.
 * @param reviews - Array of reviews to analyze
 * @param currentFilters - Current filter values (to apply other filters when counting)
 * @returns Object containing min year, max year, and count per year
 */
export function calculateReviewYearCounts(
  reviews: ReviewsValue[],
  currentFilters: ReviewsFiltersValues,
): { max: number; min: number; yearCounts: Map<number, number> } {
  // Apply all filters EXCEPT reviewYear to get the base set
  const filtersWithoutReviewYear: ReviewsFiltersValues = {
    ...currentFilters,
    reviewYear: undefined,
  };
  const filteredReviews = filterReviews(reviews, filtersWithoutReviewYear);

  if (filteredReviews.length === 0) {
    return { max: 0, min: 0, yearCounts: new Map() };
  }

  // Calculate range and counts
  const yearCounts = new Map<number, number>();
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const review of filteredReviews) {
    const year = Number.parseInt(review.reviewYear, 10);
    if (!Number.isNaN(year)) {
      min = Math.min(min, year);
      max = Math.max(max, year);
      yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
    }
  }

  return {
    max: max === Number.NEGATIVE_INFINITY ? 0 : max,
    min: min === Number.POSITIVE_INFINITY ? 0 : min,
    yearCounts,
  };
}

/**
 * Filters reviews based on grade, genre, release year, and other criteria.
 * @param sortedValues - Array of reviews to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of reviews
 */
export function filterReviews(
  sortedValues: ReviewsValue[],
  filterValues: ReviewsFiltersValues,
) {
  return filterReviewedTitles(filterValues, sortedValues, []);
}
