import { filterMaybeReviewedTitles } from "~/filterers/filterMaybeReviewedTitles";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesFiltersValues } from "./CastAndCrewMemberTitles.reducer";

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
