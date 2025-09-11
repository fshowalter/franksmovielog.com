import {
  createSelectSortedTitles,
  type TitleSort,
} from "~/components/filter-and-sort/createSelectSortedTitles";

import type { WatchlistValue } from "./WatchlistListItem";

export type WatchlistSort = TitleSort;

export const selectSortedWatchlistValues = createSelectSortedTitles<
  WatchlistValue,
  WatchlistSort
>();
