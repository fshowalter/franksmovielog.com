import { sortString } from "~/components/filter-and-sort/facets/createSorter";

type ReleaseYearSortKeys = "release-year-asc" | "release-year-desc";

type SortableByReleaseYear = {
  releaseYear: string;
};

export const releaseYearSortComparators: Record<
  ReleaseYearSortKeys,
  (a: SortableByReleaseYear, b: SortableByReleaseYear) => number
> = {
  "release-year-asc": (a, b) => sortString(a.releaseYear, b.releaseYear),
  "release-year-desc": (a, b) => sortString(a.releaseYear, b.releaseYear) * -1,
};

export const releaseYearSortOptions = [
  { label: "Release Year (Newest First)", value: "release-year-desc" },
  { label: "Release Year (Oldest First)", value: "release-year-asc" },
];
