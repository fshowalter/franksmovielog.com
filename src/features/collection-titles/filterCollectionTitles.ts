import { filterMaybeReviewedTitles } from "~/filterers/filterMaybeReviewedTitles";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesFiltersValues } from "./CollectionTitles.reducer";

export function filterCollectionTitles(
  sortedValues: CollectionTitlesValue[],
  filterValues: CollectionTitlesFiltersValues,
) {
  return filterMaybeReviewedTitles(filterValues, sortedValues, []);
}
