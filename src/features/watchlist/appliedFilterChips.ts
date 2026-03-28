import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildCollectionFilterChip } from "~/facets/collection/collectionFilterChip";
import { buildDirectorFilterChip } from "~/facets/director/directorFilterChip";
import { buildSearchChip, buildYearRangeChip } from "~/facets/filterChipBuilders";
import { buildGenresFilterChip } from "~/facets/genres/genresFilterChip";
import { buildPerformerFilterChip } from "~/facets/performer/performerFilterChip";
import { buildWriterFilterChip } from "~/facets/writer/writerFilterChip";

import type { WatchlistFiltersValues } from "./Watchlist.reducer";

export function buildAppliedFilterChips(
  filterValues: WatchlistFiltersValues,
  context?: {
    distinctReleaseYears?: readonly string[];
  },
): FilterChip[] {
  return [
    ...buildGenresFilterChip(filterValues.genres),
    ...buildYearRangeChip({
      category: "Release Year",
      distinctYears: context?.distinctReleaseYears ?? [],
      id: "releaseYear",
      value: filterValues.releaseYear,
    }),
    ...buildDirectorFilterChip(filterValues.director),
    ...buildPerformerFilterChip(filterValues.performer),
    ...buildWriterFilterChip(filterValues.writer),
    ...buildCollectionFilterChip(filterValues.collection),
    ...buildSearchChip({ id: "title", value: filterValues.title }),
  ];
}
