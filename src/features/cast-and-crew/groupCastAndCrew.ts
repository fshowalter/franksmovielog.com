import { groupCollections } from "~/groupers/groupCollections";

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewSort } from "./sortCastAndCrew";

/**
 * Groups cast and crew members based on the current sort criteria.
 * @param filteredValues - Array of filtered cast/crew members
 * @param sort - Current sort criteria
 * @returns Grouped cast/crew members
 */
export function groupCastAndCrew(
  filteredValues: CastAndCrewValue[],
  sort: CastAndCrewSort,
) {
  return groupCollections(filteredValues, sort);
}
