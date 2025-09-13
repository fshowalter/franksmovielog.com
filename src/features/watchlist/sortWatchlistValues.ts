import { createTitleSorter, type TitleSort } from "~/sorters/createTitleSorter";

import type { WatchlistValue } from "./WatchlistListItem";

export type WatchlistSort = TitleSort;

export const sortWatchlistValues = createTitleSorter<
  WatchlistValue,
  WatchlistSort
>();
