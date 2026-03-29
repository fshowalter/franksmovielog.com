import type { ReleaseDateSortKeys } from "~/components/filter-and-sort/facets/release-date/releaseDateSort";
import type { TitleSortKeys } from "~/components/filter-and-sort/facets/title/titleSort";

import { createSorter } from "~/components/filter-and-sort/facets/createSorter";
import {
  releaseDateSortComparators,
  releaseDateSortOptions,
} from "~/components/filter-and-sort/facets/release-date/releaseDateSort";
import {
  titleSortComparators,
  titleSortOptions,
} from "~/components/filter-and-sort/facets/title/titleSort";

import type { WatchlistValue } from "./Watchlist";

/**
 * Sort type for watchlist.
 */
export type WatchlistSort = ReleaseDateSortKeys | TitleSortKeys;

/**
 * Sorter function for watchlist titles, supporting title and release year sorting.
 */
export const sortWatchlist = createSorter<WatchlistValue, WatchlistSort>({
  ...titleSortComparators,
  ...releaseDateSortComparators,
});

export const sortOptions = [...titleSortOptions, ...releaseDateSortOptions];
