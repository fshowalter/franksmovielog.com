import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import {
  buildGradeChip,
  buildSearchChip,
  buildYearRangeChip,
} from "~/facets/filterChipBuilders";
import { buildGenresFilterChip } from "~/facets/genres/genresFilterChip";

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
    ...buildGradeChip(filterValues.gradeValue),
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
    ...buildSearchChip({ id: "title", value: filterValues.title }),
  ];
}
