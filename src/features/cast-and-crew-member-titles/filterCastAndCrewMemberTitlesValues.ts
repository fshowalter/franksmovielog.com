import { filterMaybeReviewedTitles } from "~/filterers/filterMaybeReviewedTitles";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesFiltersValues } from "./CastAndCrewMemberTitles.reducer";

export function filterCastAndCrewMemberTitlesValues(
  sortedValues: CastAndCrewMemberTitlesValue[],
  filterValues: CastAndCrewMemberTitlesFiltersValues,
) {
  return filterMaybeReviewedTitles(filterValues, sortedValues, []);
}
