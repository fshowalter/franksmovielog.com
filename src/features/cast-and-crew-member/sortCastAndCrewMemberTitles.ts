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

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";

/**
 * Sort type for cast and crew member titles.
 */
export type CastAndCrewMemberTitlesSort =
  | GradeSortKeys
  | ReleaseDateSortKeys
  | ReviewDateSortKeys
  | TitleSortKeys;

/**
 * Sorter function for cast and crew member titles with support for multiple sort criteria.
 */
export const sortCastAndCrewMemberTitles = createSorter<
  CastAndCrewMemberTitlesValue,
  CastAndCrewMemberTitlesSort
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
