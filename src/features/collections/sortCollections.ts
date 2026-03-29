import type { NameSortKeys } from "~/components/filter-and-sort/facets/name/nameSort";
import type { ReviewCountSortKeys } from "~/components/filter-and-sort/facets/review-count/reviewCountSort";

import { createSorter } from "~/components/filter-and-sort/facets/createSorter";
import {
  nameSortComparators,
  nameSortOptions,
} from "~/components/filter-and-sort/facets/name/nameSort";
import {
  reviewCountSortComparators,
  reviewCountSortOptions,
} from "~/components/filter-and-sort/facets/review-count/reviewCountSort";

import type { CollectionsValue } from "./Collections";

/**
 * Sort type for collections.
 */
export type CollectionsSort = NameSortKeys | ReviewCountSortKeys;

/**
 * Sorter function for collections, supporting name and review count sorting.
 */
export const sortCollections = createSorter<CollectionsValue, CollectionsSort>({
  ...nameSortComparators,
  ...reviewCountSortComparators,
});

export const sortOptions = [...nameSortOptions, ...reviewCountSortOptions];
