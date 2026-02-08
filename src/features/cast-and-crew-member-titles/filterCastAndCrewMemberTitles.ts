import { filterMaybeReviewedTitles } from "~/filterers/filterMaybeReviewedTitles";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesFiltersValues } from "./CastAndCrewMemberTitles.reducer";

/**
 * Calculates the count of titles for each genre.
 * Excludes genre filter when calculating counts (shows how many match OTHER active filters).
 * @param values - Array of cast/crew member titles
 * @param filterValues - Active filter values
 * @returns Map of genre to count
 */
export function calculateGenreCounts(
  values: CastAndCrewMemberTitlesValue[],
  filterValues: CastAndCrewMemberTitlesFiltersValues,
): Map<string, number> {
  // Apply all filters EXCEPT genres
  const filtersWithoutGenres = { ...filterValues, genres: [] };
  const filtered = filterCastAndCrewMemberTitles(values, filtersWithoutGenres);

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
 * Filters cast/crew member titles based on credited role and other criteria.
 * @param sortedValues - Array of cast/crew member titles to filter
 * @param filterValues - Object containing filter values including creditedAs
 * @returns Filtered array of cast/crew member titles
 */
export function filterCastAndCrewMemberTitles(
  sortedValues: CastAndCrewMemberTitlesValue[],
  filterValues: CastAndCrewMemberTitlesFiltersValues,
) {
  const extraFilters = [createCreditedAsFilter(filterValues.creditedAs)].filter(
    (filterFn) => filterFn !== undefined,
  );

  return filterMaybeReviewedTitles(filterValues, sortedValues, extraFilters);
}

function createCreditedAsFilter(filterValue?: string) {
  if (!filterValue) return;
  return (value: CastAndCrewMemberTitlesValue) => {
    return value.creditedAs.includes(filterValue);
  };
}
