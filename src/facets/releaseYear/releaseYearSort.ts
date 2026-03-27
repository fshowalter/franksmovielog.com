import { sortNumber } from "~/sorters/createSorter";

type ReleaseYearSortKeys = "release-date-asc" | "release-date-desc";
type SortableByReleaseDate = { releaseSequence: number };

export const releaseYearSortComparators: Record<
  ReleaseYearSortKeys,
  (a: SortableByReleaseDate, b: SortableByReleaseDate) => number
> = {
  "release-date-asc": (a, b) =>
    sortNumber(a.releaseSequence, b.releaseSequence),
  "release-date-desc": (a, b) =>
    sortNumber(a.releaseSequence, b.releaseSequence) * -1,
};

export const releaseYearSortOptions = [
  { label: "Release Date (Newest First)", value: "release-date-desc" },
  { label: "Release Date (Oldest First)", value: "release-date-asc" },
];
