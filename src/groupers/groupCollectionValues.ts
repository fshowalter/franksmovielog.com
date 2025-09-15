import type { GroupFn } from "~/groupers/groupValues";

import { getGroupLetter, groupValues } from "~/groupers/groupValues";

export type GroupableCollection = {
  name: string;
  reviewCount: number;
};

export function groupCollectionValues<
  TValue extends GroupableCollection,
  TSort extends string,
>(
  filteredValues: TValue[],
  sort: TSort,
  extraGrouper?: GroupFn<TValue, TSort>,
) {
  return groupValues(
    filteredValues,
    sort,
    createGroupForCollectionValue(extraGrouper),
  );
}

function createGroupForCollectionValue<
  TValue extends GroupableCollection,
  TSort extends string,
>(grouper: GroupFn<TValue, TSort> = () => "") {
  return function groupForTitleValue(value: TValue, sort: TSort) {
    switch (sort) {
      case "name-asc":
      case "name-desc": {
        return getGroupLetter(value.name);
      }
      case "review-count-asc":
      case "review-count-desc": {
        return "";
      }
      default: {
        return grouper(value, sort);
      }
    }
  };
}
