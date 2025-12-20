import { groupMaybeReviewedTitles } from "~/groupers/groupMaybeReviewedTitles";
import { groupValues } from "~/groupers/groupValues";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

/**
 * Groups cast/crew member titles based on the current sort criteria.
 * @param filteredValues - Array of filtered cast/crew member titles
 * @param sort - Current sort criteria
 * @param showCount - Number of items to show
 * @returns Grouped titles based on sort criteria
 */
export function groupCastAndCrewMemberTitles(
  filteredValues: CastAndCrewMemberTitlesValue[],
  sort: CastAndCrewMemberTitlesSort,
) {
  if (sort.startsWith("release-date")) {
    return groupValues(filteredValues, sort, groupForReleaseDateValue);
  }

  return groupMaybeReviewedTitles(filteredValues, sort);
}

function groupForReleaseDateValue(
  value: CastAndCrewMemberTitlesValue,
  sort: CastAndCrewMemberTitlesSort,
) {
  switch (sort) {
    case "release-date-asc":
    case "release-date-desc": {
      return `${value.releaseYear.slice(0, 3)}0s`;
    }
    default: {
      return "";
    }
  }
}
