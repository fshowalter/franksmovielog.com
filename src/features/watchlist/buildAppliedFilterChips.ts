import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildCollectionsFilterChips } from "~/components/filter-and-sort/facets/collections/buildCollectionsFilterChips";
import { buildDirectorsFilterChips } from "~/components/filter-and-sort/facets/directors/buildDirectorsFilterChips";
import { buildGenresFilterChips } from "~/components/filter-and-sort/facets/genres/buildGenresFilterChips";
import { buildPerformersFilterChips } from "~/components/filter-and-sort/facets/performers/buildPerformersFilterChips";
import { buildReleaseYearFilterChip } from "~/components/filter-and-sort/facets/release-year/buildReleaseYearFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/buildTitleFilterChip";
import { buildWritersFilterChips } from "~/components/filter-and-sort/facets/writers/buildWritersFilterChips";

import type { WatchlistFiltersValues } from "./watchlistReducer";

export function buildAppliedFilterChips(
  filterValues: WatchlistFiltersValues,
): FilterChip[] {
  return [
    ...buildGenresFilterChips(filterValues.genres),
    ...buildReleaseYearFilterChip(filterValues.releaseYear),
    ...buildDirectorsFilterChips(filterValues.directors),
    ...buildPerformersFilterChips(filterValues.performers),
    ...buildWritersFilterChips(filterValues.writers),
    ...buildCollectionsFilterChips(filterValues.collections),
    ...buildTitleFilterChip(filterValues.title),
  ];
}
