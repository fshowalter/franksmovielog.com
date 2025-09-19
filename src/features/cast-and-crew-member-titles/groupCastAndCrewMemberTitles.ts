import { groupMaybeReviewedTitles } from "~/groupers/groupMaybeReviewedTitles";

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
  showCount: number,
) {
  return groupMaybeReviewedTitles(filteredValues, showCount, sort);
}
