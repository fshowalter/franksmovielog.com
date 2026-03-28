import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildSearchChip, buildYearRangeChip } from "~/facets/filterChipBuilders";
import { buildMediumFilterChip } from "~/facets/medium/mediumFilterChip";
import { buildReviewedStatusFilterChip } from "~/facets/reviewedStatus/reviewedStatusFilterChip";
import { buildVenueFilterChip } from "~/facets/venue/venueFilterChip";

import type { ViewingsFiltersValues } from "./Viewings.reducer";

export function buildAppliedFilterChips(
  filterValues: ViewingsFiltersValues,
  context?: {
    distinctReleaseYears?: readonly string[];
    distinctViewingYears?: readonly string[];
  },
): FilterChip[] {
  return [
    ...buildYearRangeChip({
      category: "Release Year",
      distinctYears: context?.distinctReleaseYears ?? [],
      id: "releaseYear",
      value: filterValues.releaseYear,
    }),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
    ...buildYearRangeChip({
      category: "Viewing Year",
      distinctYears: context?.distinctViewingYears ?? [],
      id: "viewingYear",
      value: filterValues.viewingYear,
    }),
    ...buildMediumFilterChip(filterValues.medium),
    ...buildVenueFilterChip(filterValues.venue),
    ...buildSearchChip({ id: "title", value: filterValues.title }),
  ];
}
