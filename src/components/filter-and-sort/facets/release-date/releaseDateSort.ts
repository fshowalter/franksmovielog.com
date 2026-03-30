import { sortNumber } from "~/components/filter-and-sort/facets/createSorter";

export type ReleaseDateSortKeys = "release-date-asc" | "release-date-desc";

export type SortableByReleaseDate = {
  releaseSequence: number;
};

export const releaseDateSortComparators: Record<
  ReleaseDateSortKeys,
  (a: SortableByReleaseDate, b: SortableByReleaseDate) => number
> = {
  "release-date-asc": (a, b) =>
    sortNumber(a.releaseSequence, b.releaseSequence),
  "release-date-desc": (a, b) =>
    sortNumber(b.releaseSequence, a.releaseSequence),
};

export const releaseDateSortOptions = [
  { label: "Release Date (Newest First)", value: "release-date-desc" },
  { label: "Release Date (Oldest First)", value: "release-date-asc" },
];
