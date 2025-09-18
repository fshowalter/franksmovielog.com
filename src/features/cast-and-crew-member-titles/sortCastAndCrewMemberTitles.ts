import type { MaybeReviewedTitleSort } from "~/sorters/createMaybeReviewedTitleSorter";

import { createMaybeReviewedTitleSorter } from "~/sorters/createMaybeReviewedTitleSorter";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";

/**
 * Sort type for cast and crew member titles.
 */
export type CastAndCrewMemberTitlesSort = MaybeReviewedTitleSort;

/**
 * Sorter function for cast and crew member titles with support for multiple sort criteria.
 */
export const sortCastAndCrewMemberTitles = createMaybeReviewedTitleSorter<
  CastAndCrewMemberTitlesValue,
  CastAndCrewMemberTitlesSort
>();
