import type { GroupFn } from "~/groupers/groupValues";

import { getGroupLetter, groupValues } from "~/groupers/groupValues";

export type GroupableTitle = {
  releaseYear: string;
  sortTitle: string;
};

export function groupTitles<
  TValue extends GroupableTitle,
  TSort extends string,
>(
  filteredValues: TValue[],
  showCount: number,
  sort: TSort,
  extraGrouper?: GroupFn<TValue, TSort>,
) {
  const paginatedValues = filteredValues.slice(0, showCount);

  return groupValues(paginatedValues, sort, createGroupForTitle(extraGrouper));
}

function createGroupForTitle<
  TValue extends GroupableTitle,
  TSort extends string,
>(grouper: GroupFn<TValue, TSort> = () => "") {
  return function groupForTitleValue(value: TValue, sort: TSort) {
    switch (sort) {
      case "release-date-asc":
      case "release-date-desc": {
        return value.releaseYear;
      }
      case "title-asc":
      case "title-desc": {
        return getGroupLetter(value.sortTitle);
      }
      default: {
        return grouper(value, sort);
      }
    }
  };
}
