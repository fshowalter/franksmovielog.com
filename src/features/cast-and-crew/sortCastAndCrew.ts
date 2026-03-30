import type { NameSortKeys } from "~/components/filter-and-sort/facets/name/nameSort";
import type { ReviewCountSortKeys } from "~/components/filter-and-sort/facets/review-count/reviewCountSort";

import { createSorter } from "~/components/filter-and-sort/facets/createSorter";
import {
  nameSortComparators,
  nameSortOptions,
} from "~/components/filter-and-sort/facets/name/nameSort";
import {
  reviewCountSortComparators,
  reviewCountSortOptions,
} from "~/components/filter-and-sort/facets/review-count/reviewCountSort";

import type { CastAndCrewValue } from "./CastAndCrew";

export type CastAndCrewSort = NameSortKeys | ReviewCountSortKeys;

export const sortCastAndCrew = createSorter<CastAndCrewValue, CastAndCrewSort>({
  ...nameSortComparators,
  ...reviewCountSortComparators,
});

export const sortOptions = [...nameSortOptions, ...reviewCountSortOptions];
