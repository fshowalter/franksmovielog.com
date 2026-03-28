import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildYearRangeChip } from "~/components/filter-and-sort/facets/filterChipBuilders";
import { buildGenresFilterChip } from "~/components/filter-and-sort/facets/genres/genresFilterChips";
import { buildGradeFilterChip } from "~/components/filter-and-sort/facets/grade/gradeFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/titleFilterChip";

import type { ReviewsFiltersValues } from "./reducer";

export function buildAppliedFilterChips(
  filterValues: ReviewsFiltersValues,
  context?: {
    distinctReleaseYears?: readonly string[];
    distinctReviewYears?: readonly string[];
  },
): FilterChip[] {
  return [
    ...buildGenresFilterChip(filterValues.genres),
    ...buildGradeFilterChip(filterValues.gradeValue),
    ...buildYearRangeChip({
      category: "Release Year",
      distinctYears: context?.distinctReleaseYears ?? [],
      id: "releaseYear",
      value: filterValues.releaseYear,
    }),
    ...buildYearRangeChip({
      category: "Review Year",
      distinctYears: context?.distinctReviewYears ?? [],
      id: "reviewYear",
      value: filterValues.reviewYear,
    }),
    ...buildTitleFilterChip(filterValues.title),
  ];
}
