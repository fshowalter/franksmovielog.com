import { sortString } from "~/sorters/createSorter";

export const nameSortComparators = {
  "name-asc": (a: { sortName: string }, b: { sortName: string }) =>
    sortString(a.sortName, b.sortName),
  "name-desc": (a: { sortName: string }, b: { sortName: string }) =>
    sortString(a.sortName, b.sortName) * -1,
};

export const nameSortOptions = [
  { label: "Name (A → Z)", value: "name-asc" },
  { label: "Name (Z → A)", value: "name-desc" },
];
