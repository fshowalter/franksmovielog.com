import { groupMaybeReviewedTitles } from "~/groupers/groupMaybeReviewedTitles";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesSort } from "./sortCollectionTitles";

export function groupCollectionTitles(
  filteredValues: CollectionTitlesValue[],
  sort: CollectionTitlesSort,
  showCount: number,
) {
  return groupMaybeReviewedTitles(filteredValues, showCount, sort);
}
