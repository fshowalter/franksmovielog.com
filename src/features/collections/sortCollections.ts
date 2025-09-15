import type { CollectionSort } from "~/sorters/createCollectionSorter";

import { createCollectionSorter } from "~/sorters/createCollectionSorter";

import type { CollectionsValue } from "./Collections";

export type CollectionsSort = CollectionSort;

export const sortCollections = createCollectionSorter<
  CollectionsValue,
  CollectionsSort
>();
