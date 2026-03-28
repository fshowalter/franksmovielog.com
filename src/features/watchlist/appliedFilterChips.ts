import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildCollectionsFilterChips } from "~/components/filter-and-sort/facets/collections/collectionsFilterChips";
import { buildDirectorsFilterChips } from "~/components/filter-and-sort/facets/directors/directorsFilterChips";
import { buildGenresFilterChips } from "~/components/filter-and-sort/facets/genres/genresFilterChips";
import { buildPerformersFilterChips } from "~/components/filter-and-sort/facets/performers/performersFilterChips";
import { buildReleaseYearFilterChip } from "~/components/filter-and-sort/facets/releaseYear/releaseYearFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/titleFilterChip";
import { buildWritersFilterChips } from "~/components/filter-and-sort/facets/writers/writersFilterChips";

import type { WatchlistFiltersValues } from "./Watchlist.reducer";

export function buildAppliedFilterChips(
  filterValues: WatchlistFiltersValues,
): FilterChip[] {
  return [
    ...buildGenresFilterChips(filterValues.genres),
    ...buildReleaseYearFilterChip(filterValues.releaseYear),
    ...buildDirectorsFilterChips(filterValues.director),
    ...buildPerformersFilterChips(filterValues.performer),
    ...buildWritersFilterChips(filterValues.writer),
    ...buildCollectionsFilterChips(filterValues.collection),
    ...buildTitleFilterChip(filterValues.title),
  ];
}
