import type { CollectionSort } from "~/sorters/createCollectionSorter";

import { createCollectionSorter } from "~/sorters/createCollectionSorter";

import type { CastAndCrewValue } from "./CastAndCrew";

export type CastAndCrewSort = CollectionSort;

export const sortCastAndCrewValues = createCollectionSorter<
  CastAndCrewValue,
  CastAndCrewSort
>();
