import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildGenresFilterChips } from "~/components/filter-and-sort/facets/genres/genresFilterChips";
import { buildGradeFilterChip } from "~/components/filter-and-sort/facets/grade/gradeFilterChip";
import { buildReleaseYearFilterChip } from "~/components/filter-and-sort/facets/release-year/releaseYearFilterChip";
import { buildReviewYearFilterChip } from "~/components/filter-and-sort/facets/review-year/reviewYearFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/titleFilterChip";

import type { ReviewsFiltersValues } from "./reducer";

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
