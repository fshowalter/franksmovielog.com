import type { MaybeReviewedTitleSort } from "~/sorters/createMaybeReviewedTitleSorter";

import { createMaybeReviewedTitleSorter } from "~/sorters/createMaybeReviewedTitleSorter";

import type { CollectionTitlesValue } from "./CollectionTitles";

/**
 * Sort type for collection titles.
 */
export type CollectionTitlesSort = MaybeReviewedTitleSort;

/**
 * Sorter function for collection titles with support for title, grade, and release date sorting.
 */
export const sortCollectionTitles = createMaybeReviewedTitleSorter<
  CollectionTitlesValue,
  CollectionTitlesSort
>();
