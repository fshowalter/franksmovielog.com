import { createCreditedAsFilter } from "~/components/filter-and-sort/facets/credited-as/creditedAsFilter";
import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createGenresFilter } from "~/components/filter-and-sort/facets/genres/genresFilter";
import { createGradeFilter } from "~/components/filter-and-sort/facets/grade/gradeFilter";
import { createReleaseYearFilter } from "~/components/filter-and-sort/facets/release-year/releaseYearFilter";
import { createReviewYearFilter } from "~/components/filter-and-sort/facets/review-year/reviewYearFilter";
import { createReviewedStatusFilter } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilter";
import { createTitleFilter } from "~/components/filter-and-sort/facets/title/titleFilter";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesFiltersValues } from "./castAndCrewMemberTitlesReducer";

/**
 * Filters cast/crew member titles based on credited role and other criteria.
 * @param sortedValues - Array of cast/crew member titles to filter
 * @param filterValues - Object containing filter values including creditedAs
 * @returns Filtered array of cast/crew member titles
 */
export function filterCastAndCrewMemberTitles(
  sortedValues: readonly CastAndCrewMemberTitlesValue[],
  filterValues: CastAndCrewMemberTitlesFiltersValues,
) {
  const filters = [
    createGradeFilter(filterValues),
    createCreditedAsFilter(filterValues),
    createTitleFilter(filterValues),
    createReviewedStatusFilter(filterValues),
    createReleaseYearFilter(filterValues),
    createGenresFilter(filterValues),
    createReviewYearFilter(filterValues),
  ].filter((f) => f !== undefined);

  return filterSortedValues({ filters, sortedValues });
}
