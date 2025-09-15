import type { MaybeReviewedTitleSort } from "~/sorters/createMaybeReviewedTitleSorter";

import { createMaybeReviewedTitleSorter } from "~/sorters/createMaybeReviewedTitleSorter";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";

export type CastAndCrewMemberTitlesSort = MaybeReviewedTitleSort;

export const sortCastAndCrewMemberTitles = createMaybeReviewedTitleSorter<
  CastAndCrewMemberTitlesValue,
  CastAndCrewMemberTitlesSort
>();
