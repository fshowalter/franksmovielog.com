import type { CollectionSort } from "~/sorters/createCollectionSorter";

import { createCollectionSorter } from "~/sorters/createCollectionSorter";

import type { CollectionsValue } from "./Collections";

/**
 * Sort type for collections.
 */
export type CollectionsSort = CollectionSort;

/**
 * Sorter function for collections, supporting name and review count sorting.
 */
export const sortCollections = createCollectionSorter<
  CollectionsValue,
  CollectionsSort
>();
