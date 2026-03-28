import type { FilterChip } from "~/components/filter-and-sort/container/AppliedFiltersSection";

import { buildCreditedAsFilterChip } from "~/facets/creditedAs/creditedAsFilterChip";
import {
  buildGradeChip,
  buildSearchChip,
  buildYearRangeChip,
} from "~/facets/filterChipBuilders";
import { buildGenresFilterChip } from "~/facets/genres/genresFilterChip";
import { buildReviewedStatusFilterChip } from "~/facets/reviewedStatus/reviewedStatusFilterChip";

import type { CastAndCrewMemberTitlesFiltersValues } from "./CastAndCrewMemberTitles.reducer";

export function buildAppliedFilterChips(
  filterValues: CastAndCrewMemberTitlesFiltersValues,
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
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
    ...buildCreditedAsFilterChip(filterValues.creditedAs),
    ...buildSearchChip({ id: "title", value: filterValues.title }),
  ];
}
