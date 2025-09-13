import type { GroupFn } from "~/groupers/groupValues";
import type { SortableTitle } from "~/sorters/createTitleSorter";

import { getGroupLetter, groupValues } from "~/groupers/groupValues";

export function groupTitleValues<
  TValue extends SortableTitle,
  TSort extends string,
>(
  filteredValues: TValue[],
  showCount: number,
  sort: TSort,
  extraGrouper?: GroupFn<TValue, TSort>,
) {
  return groupValues(
    filteredValues,
    showCount,
    sort,
    createGroupForTitleValue(extraGrouper),
  );
}

function createGroupForTitleValue<
  TValue extends SortableTitle,
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
