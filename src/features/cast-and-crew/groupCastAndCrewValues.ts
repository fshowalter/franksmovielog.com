import { groupCollectionValues } from "~/groupers/groupCollectionValues";

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewSort } from "./sortCastAndCrewValues";

export function groupCastAndCrewValues(
  filteredValues: CastAndCrewValue[],
  sort: CastAndCrewSort,
) {
  return groupCollectionValues(filteredValues, sort);
}
