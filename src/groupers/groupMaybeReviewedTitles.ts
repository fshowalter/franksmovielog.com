import type { GroupFn } from "~/groupers/groupValues";

import type { GroupableTitle } from "./groupTitles";

import { groupTitles } from "./groupTitles";

type GroupableMaybeReviewedTitle = GroupableTitle & {
  grade?: string;
  reviewMonth?: string;
  reviewYear?: string;
};

export function groupMaybeReviewedTitles<
  TValue extends GroupableMaybeReviewedTitle,
  TSort extends string,
>(
  filteredValues: TValue[],
  showCount: number,
  sort: TSort,
  extraGrouper?: GroupFn<TValue, TSort>,
) {
  return groupTitles(
    filteredValues,
    showCount,
    sort,
    createGroupForMaybeReviewedTitle(extraGrouper),
  );
}

function createGroupForMaybeReviewedTitle<
  TValue extends GroupableMaybeReviewedTitle,
  TSort extends string,
>(grouper: GroupFn<TValue, TSort> = () => "") {
  return function groupForTitleValue(value: TValue, sort: TSort) {
    switch (sort) {
      case "grade-asc":
      case "grade-desc": {
        return value.grade || "Unreviewed";
      }
      case "review-date-asc":
      case "review-date-desc": {
        if (value.reviewMonth) {
          return `${value.reviewMonth} ${value.reviewYear}`;
        }
        return value.reviewYear || "Unreviewed";
      }
      default: {
        return grouper(value, sort);
      }
    }
  };
}
