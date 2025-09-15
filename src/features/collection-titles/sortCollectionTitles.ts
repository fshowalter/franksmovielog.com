import type { MaybeReviewedTitleSort } from "~/sorters/createMaybeReviewedTitleSorter";

import { createMaybeReviewedTitleSorter } from "~/sorters/createMaybeReviewedTitleSorter";

import type { CollectionTitlesValue } from "./CollectionTitles";

export type CollectionTitlesSort = MaybeReviewedTitleSort;

export const sortCollectionTitles = createMaybeReviewedTitleSorter<
  CollectionTitlesValue,
  CollectionTitlesSort
>();
