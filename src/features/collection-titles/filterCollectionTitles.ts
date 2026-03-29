import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createGenresFilter } from "~/components/filter-and-sort/facets/genres/genresFilter";
import { createGradeFilter } from "~/components/filter-and-sort/facets/grade/gradeFilter";
import { createReleaseYearFilter } from "~/components/filter-and-sort/facets/release-year/releaseYearFilter";
import { createReviewYearFilter } from "~/components/filter-and-sort/facets/review-year/reviewYearFilter";
import { createReviewedStatusFilter } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilter";
import { createTitleFilter } from "~/components/filter-and-sort/facets/title/titleFilter";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesFiltersValues } from "./CollectionTitles.reducer";

/**
 * Filters collection titles based on review status, genre, and other criteria.
 * @param sortedValues - Array of collection titles to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of collection titles
 */
export function filterCollectionTitles(
  sortedValues: readonly CollectionTitlesValue[],
  filterValues: CollectionTitlesFiltersValues,
) {
  const filters = [
    createTitleFilter(filterValues),
    createReleaseYearFilter(filterValues),
    createGenresFilter(filterValues),
    createGradeFilter(filterValues),
    createReviewYearFilter(filterValues),
    createReviewedStatusFilter(filterValues),
  ].filter((f) => f !== undefined);

  return filterSortedValues({ filters, sortedValues });
}
