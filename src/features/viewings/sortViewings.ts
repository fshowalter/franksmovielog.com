import type { ViewingDateSortKeys } from "~/components/filter-and-sort/facets/viewing-date/viewingDateSort";

import { createSorter } from "~/components/filter-and-sort/facets/createSorter";
import {
  viewingDateSortComparators,
  viewingDateSortOptions,
} from "~/components/filter-and-sort/facets/viewing-date/viewingDateSort";

import type { ViewingsValue } from "./Viewings";

/**
 * Sort type for viewings.
 */
export type ViewingsSort = ViewingDateSortKeys;

/**
 * Sorter function for viewings, supporting chronological sorting by viewing date.
 */
export const sortViewings = createSorter<ViewingsValue, ViewingsSort>({
  ...viewingDateSortComparators,
});

export const sortOptions = [...viewingDateSortOptions];
