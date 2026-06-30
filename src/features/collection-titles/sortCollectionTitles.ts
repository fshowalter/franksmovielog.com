import type { GradeSortKeys } from "~/components/filter-and-sort/facets/grade/gradeSort";
import type { ReleaseDateSortKeys } from "~/components/filter-and-sort/facets/release-date/releaseDateSort";
import type { ReviewDateSortKeys } from "~/components/filter-and-sort/facets/review-date/reviewDateSort";
import type { TitleSortKeys } from "~/components/filter-and-sort/facets/title/titleSort";

import { createSorter } from "~/components/filter-and-sort/facets/createSorter";
import {
  gradeSortComparators,
  gradeSortOptions,
} from "~/components/filter-and-sort/facets/grade/gradeSort";
import {
  releaseDateSortComparators,
  releaseDateSortOptions,
} from "~/components/filter-and-sort/facets/release-date/releaseDateSort";
import {
  reviewDateSortComparators,
  reviewDateSortOptions,
} from "~/components/filter-and-sort/facets/review-date/reviewDateSort";
import {
  titleSortComparators,
  titleSortOptions,
} from "~/components/filter-and-sort/facets/title/titleSort";

import type { CollectionTitlesValue } from "./CollectionTitles";

/**
 * Sort type for collection titles.
 */
export type CollectionTitlesSort =
  GradeSortKeys | ReleaseDateSortKeys | ReviewDateSortKeys | TitleSortKeys;

/**
 * Sorter function for collection titles with support for title, grade, and release date sorting.
 */
export const sortCollectionTitles = createSorter<
  CollectionTitlesValue,
  CollectionTitlesSort
>({
  ...titleSortComparators,
  ...releaseDateSortComparators,
  ...gradeSortComparators,
  ...reviewDateSortComparators,
});

export const sortOptions = [
  ...titleSortOptions,
  ...releaseDateSortOptions,
  ...gradeSortOptions,
  ...reviewDateSortOptions,
];
