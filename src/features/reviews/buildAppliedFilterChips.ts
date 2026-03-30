import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildGenresFilterChips } from "~/components/filter-and-sort/facets/genres/buildGenresFilterChips";
import { buildGradeFilterChip } from "~/components/filter-and-sort/facets/grade/buildGradeFilterChip";
import { buildReleaseYearFilterChip } from "~/components/filter-and-sort/facets/release-year/buildReleaseYearFilterChip";
import { buildReviewYearFilterChip } from "~/components/filter-and-sort/facets/review-year/buildReviewYearFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/buildTitleFilterChip";

import type { ReviewsFiltersValues } from "./reviewsReducer";

export function buildAppliedFilterChips(
  filterValues: ReviewsFiltersValues,
): FilterChip[] {
  return [
    ...buildGenresFilterChips(filterValues.genres),
    ...buildGradeFilterChip(filterValues.gradeValue),
    ...buildReleaseYearFilterChip(filterValues.releaseYear),
    ...buildReviewYearFilterChip(filterValues.reviewYear),
    ...buildTitleFilterChip(filterValues.title),
  ];
}
