import { sortString } from "~/components/filter-and-sort/facets/createSorter";

type SortableByViewingYear = {
  viewingYear: string;
};

type ViewingYearSortKeys = "viewing-year-asc" | "viewing-year-desc";

export const viewingYearSortComparators: Record<
  ViewingYearSortKeys,
  (a: SortableByViewingYear, b: SortableByViewingYear) => number
> = {
  "viewing-year-asc": (a, b) => sortString(a.viewingYear, b.viewingYear),
  "viewing-year-desc": (a, b) => sortString(a.viewingYear, b.viewingYear) * -1,
};

export const viewingYearSortOptions = [
  { label: "Viewing Year (Newest First)", value: "viewing-year-desc" },
  { label: "Viewing Year (Oldest First)", value: "viewing-year-asc" },
];
