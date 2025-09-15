import { groupMaybeReviewedTitles } from "~/groupers/groupMaybeReviewedTitles";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

export function groupCastAndCrewMemberTitles(
  filteredValues: CastAndCrewMemberTitlesValue[],
  sort: CastAndCrewMemberTitlesSort,
  showCount: number,
) {
  return groupMaybeReviewedTitles(filteredValues, showCount, sort);
}
