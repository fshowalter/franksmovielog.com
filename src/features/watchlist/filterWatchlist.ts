import { createCollectionsFilter } from "~/components/filter-and-sort/facets/collections/collectionsFilter";
import { createDirectorsFilter } from "~/components/filter-and-sort/facets/directors/directorsFilter";
import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createPerformersFilter } from "~/components/filter-and-sort/facets/performers/performersFilter";
import { createTitleFilter } from "~/components/filter-and-sort/facets/title/titleFilter";
import { createWritersFilter } from "~/components/filter-and-sort/facets/writers/writersFilter";

import type { WatchlistValue } from "./Watchlist";
import type { WatchlistFiltersValues } from "./watchlistReducer";

export function filterWatchlist(
  sortedValues: readonly WatchlistValue[],
  filterValues: WatchlistFiltersValues,
) {
  const filters = [
    createTitleFilter(filterValues),
    createDirectorsFilter(filterValues),
    createPerformersFilter(filterValues),
    createWritersFilter(filterValues),
    createCollectionsFilter(filterValues),
  ].filter((filterFn) => filterFn !== undefined);

  return filterSortedValues({ filters, sortedValues });
}
