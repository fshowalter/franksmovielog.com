import {
  createTitleSorter,
  type SortableTitle,
} from "~/sorters/createTitleSorter";

export function createSelectSortedTitles<
  TValue extends SortableTitle,
  TSort extends string,
>(sortMap?: Record<string, (a: TValue, b: TValue) => number>) {
  const sorter = createTitleSorter<TValue, TSort>({
    ...sortMap,
  });

  return function selectSortedTitles(values: TValue[], sort: TSort) {
    return sorter(values, sort);
  };
}
