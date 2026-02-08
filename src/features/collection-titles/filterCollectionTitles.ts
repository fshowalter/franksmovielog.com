import { filterMaybeReviewedTitles } from "~/filterers/filterMaybeReviewedTitles";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesFiltersValues } from "./CollectionTitles.reducer";

/**
 * Calculates the count of titles for each genre.
 * Excludes genre filter when calculating counts (shows how many match OTHER active filters).
 * @param values - Array of collection titles
 * @param filterValues - Active filter values
 * @returns Map of genre to count
 */
export function calculateGenreCounts(
  values: CollectionTitlesValue[],
  filterValues: CollectionTitlesFiltersValues,
): Map<string, number> {
  // Apply all filters EXCEPT genres
  const filtersWithoutGenres = { ...filterValues, genres: [] };
  const filtered = filterCollectionTitles(values, filtersWithoutGenres);

  // Count occurrences of each genre
  const counts = new Map<string, number>();
  for (const value of filtered) {
    for (const genre of value.genres) {
      counts.set(genre, (counts.get(genre) || 0) + 1);
    }
  }

  return counts;
}

/**
 * Filters collection titles based on review status, genre, and other criteria.
 * @param sortedValues - Array of collection titles to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of collection titles
 */
export function filterCollectionTitles(
  sortedValues: CollectionTitlesValue[],
  filterValues: CollectionTitlesFiltersValues,
) {
  return filterMaybeReviewedTitles(filterValues, sortedValues, []);
}
