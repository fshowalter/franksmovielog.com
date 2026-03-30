import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildMediumFilterChips } from "~/components/filter-and-sort/facets/medium/buildMediumFilterChips";
import { buildReleaseYearFilterChip } from "~/components/filter-and-sort/facets/release-year/buildReleaseYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/filter-and-sort/facets/reviewed-status/buildReviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/buildTitleFilterChip";
import { buildVenueFilterChips } from "~/components/filter-and-sort/facets/venue/buildVenueFilterChips";
import { buildViewingYearFilterChip } from "~/components/filter-and-sort/facets/viewing-year/buildViewingYearFilterChip";

import type { ViewingsFiltersValues } from "./viewingsReducer";

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
