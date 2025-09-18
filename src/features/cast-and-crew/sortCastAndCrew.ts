import type { CollectionSort } from "~/sorters/createCollectionSorter";

import { createCollectionSorter } from "~/sorters/createCollectionSorter";

import type { CastAndCrewValue } from "./CastAndCrew";

/**
 * Sort type for cast and crew.
 */
export type CastAndCrewSort = CollectionSort;

/**
 * Sorter function for cast and crew members, supporting name and review count sorting.
 */
export const sortCastAndCrew = createCollectionSorter<
  CastAndCrewValue,
  CastAndCrewSort
>();
