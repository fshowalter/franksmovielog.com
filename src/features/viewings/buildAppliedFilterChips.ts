import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildMediumFilterChips } from "~/components/filter-and-sort/facets/medium/mediumFilterChips";
import { buildReleaseYearFilterChip } from "~/components/filter-and-sort/facets/release-year/releaseYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/titleFilterChip";
import { buildVenueFilterChips } from "~/components/filter-and-sort/facets/venue/venueFilterChips";
import { buildViewingYearFilterChip } from "~/components/filter-and-sort/facets/viewing-year/viewingYearFilterChip";

import type { ViewingsFiltersValues } from "./Viewings.reducer";

export function buildAppliedFilterChips(
  filterValues: ViewingsFiltersValues,
): FilterChip[] {
  return [
    ...buildReleaseYearFilterChip(filterValues.releaseYear),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
    ...buildViewingYearFilterChip(filterValues.viewingYear),
    ...buildMediumFilterChips(filterValues.medium),
    ...buildVenueFilterChips(filterValues.venue),
    ...buildTitleFilterChip(filterValues.title),
  ];
}
