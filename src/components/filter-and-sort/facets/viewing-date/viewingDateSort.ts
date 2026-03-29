import { sortString } from "~/components/filter-and-sort/facets/createSorter";

export type SortableByViewingDate = {
  sequence: string;
};

export type ViewingDateSortKeys = "viewing-date-asc" | "viewing-date-desc";

export const viewingDateSortComparators: Record<
  ViewingDateSortKeys,
  (a: SortableByViewingDate, b: SortableByViewingDate) => number
> = {
  "viewing-date-asc": (a, b) => sortString(a.sequence, b.sequence),
  "viewing-date-desc": (a, b) => sortString(b.sequence, a.sequence),
};

export const viewingDateSortOptions = [
  { label: "Viewing Date (Newest First)", value: "viewing-date-desc" },
  { label: "Viewing Date (Oldest First)", value: "viewing-date-asc" },
];
