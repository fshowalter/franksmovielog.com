import { filterMaybeReviewedTitles } from "~/filterers/filterMaybeReviewedTitles";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesFiltersValues } from "./CastAndCrewMemberTitles.reducer";

/**
 * Calculates the count of titles for each credited role.
 * Excludes creditedAs filter when calculating counts (shows how many match OTHER active filters).
 * @param values - Array of cast/crew member titles
 * @param filterValues - Active filter values
 * @returns Map of credited role to count
 */
export function calculateCreditedAsCounts(
  values: CastAndCrewMemberTitlesValue[],
  filterValues: CastAndCrewMemberTitlesFiltersValues,
): Map<string, number> {
  // Apply all filters EXCEPT creditedAs
  const filtersWithoutCreditedAs = { ...filterValues, creditedAs: undefined };
  const filtered = filterCastAndCrewMemberTitles(
    values,
    filtersWithoutCreditedAs,
  );

  // Count occurrences of each credit role
  const counts = new Map<string, number>();
  for (const value of filtered) {
    for (const credit of value.creditedAs) {
      counts.set(credit, (counts.get(credit) || 0) + 1);
    }
  }

  return counts;
}

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
 * Calculates the count of titles for each reviewed status.
 * Excludes reviewed status filter when calculating counts.
 * @param values - Array of cast/crew member titles
 * @param filterValues - Active filter values
 * @returns Map of reviewed status to count
 */
export function calculateReviewedStatusCounts(
  values: CastAndCrewMemberTitlesValue[],
  filterValues: CastAndCrewMemberTitlesFiltersValues,
): Map<string, number> {
  // Apply all filters EXCEPT reviewedStatus
  const filtersWithoutReviewedStatus = {
    ...filterValues,
    reviewedStatus: undefined,
  };
  const allFiltered = filterCastAndCrewMemberTitles(
    values,
    filtersWithoutReviewedStatus,
  );

  // Count reviewed vs not reviewed (reviewed = has slug)
  const reviewedCount = allFiltered.filter((v) => !!v.slug).length;
  const notReviewedCount = allFiltered.length - reviewedCount;

  return new Map([
    ["All", allFiltered.length],
    ["Not Reviewed", notReviewedCount],
    ["Reviewed", reviewedCount],
  ]);
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

function createCreditedAsFilter(filterValues?: readonly string[]) {
  if (!filterValues || filterValues.length === 0) return;
  return (value: CastAndCrewMemberTitlesValue) => {
    // Title matches if it has at least one of the selected credits
    return filterValues.some((filterValue) =>
      value.creditedAs.includes(filterValue),
    );
  };
}
