import type { TitleSort } from "~/sorters/createTitleSorter";

import { createTitleSorter } from "~/sorters/createTitleSorter";

import type { WatchlistValue } from "./Watchlist";

/**
 * Sort type for watchlist.
 */
export type WatchlistSort = TitleSort;

/**
 * Sorter function for watchlist titles, supporting title and release year sorting.
 */
export const sortWatchlistValues = createTitleSorter<
  WatchlistValue,
  WatchlistSort
>();
