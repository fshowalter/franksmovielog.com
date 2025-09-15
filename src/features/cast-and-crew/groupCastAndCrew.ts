import { groupCollections } from "~/groupers/groupCollections";

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewSort } from "./sortCastAndCrew";

export function groupCastAndCrew(
  filteredValues: CastAndCrewValue[],
  sort: CastAndCrewSort,
) {
  return groupCollections(filteredValues, sort);
}
