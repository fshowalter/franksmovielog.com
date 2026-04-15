import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildCreditedAsFilterChips } from "~/components/filter-and-sort/facets/credited-as/buildCreditedAsFilterChips";
import { buildGenresFilterChips } from "~/components/filter-and-sort/facets/genres/buildGenresFilterChips";
import { buildGradeFilterChip } from "~/components/filter-and-sort/facets/grade/buildGradeFilterChip";
import { buildReleaseYearFilterChip } from "~/components/filter-and-sort/facets/release-year/buildReleaseYearFilterChip";
import { buildReviewYearFilterChip } from "~/components/filter-and-sort/facets/review-year/buildReviewYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/filter-and-sort/facets/reviewed-status/buildReviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/buildTitleFilterChip";

import type { CastAndCrewMemberTitlesFiltersValues } from "./castAndCrewMemberTitlesReducer";

export function buildAppliedFilterChips(
  filterValues: CastAndCrewMemberTitlesFiltersValues,
): FilterChip[] {
  return [
    ...buildGenresFilterChips(filterValues.genres),
    ...buildGradeFilterChip(filterValues.gradeValue),
    ...buildReleaseYearFilterChip(filterValues.releaseYear),
    ...buildReviewYearFilterChip(filterValues.reviewYear),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
    ...buildCreditedAsFilterChips(filterValues.creditedAs),
    ...buildTitleFilterChip(filterValues.title),
  ];
}
