import { groupMaybeReviewedTitleValues } from "~/groupers/groupMaybeReviewedTitleValues";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitlesValues";

export function groupCastAndCrewMemberTitlesValues(
  filteredValues: CastAndCrewMemberTitlesValue[],
  sort: CastAndCrewMemberTitlesSort,
  showCount: number,
) {
  return groupMaybeReviewedTitleValues(filteredValues, showCount, sort);
}
