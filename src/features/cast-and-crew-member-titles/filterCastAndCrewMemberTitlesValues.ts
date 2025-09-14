import { filterReviewedTitles } from "~/filterers/filterReviewedTitles";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesFiltersValues } from "./CastAndCrewMemberTitles.reducer";

export function filterCastAndCrewMemberTitlesValues(
  sortedValues: CastAndCrewMemberTitlesValue[],
  filterValues: CastAndCrewMemberTitlesFiltersValues,
) {
  return filterReviewedTitles(filterValues, sortedValues, []);
}
