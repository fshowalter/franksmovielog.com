import type { GroupFn } from "~/groupers/groupValues";

import { type GroupableTitle, groupTitleValues } from "./groupTitleValues";

type GroupableMaybeReviewedTitle = GroupableTitle & {
  grade?: string;
  reviewMonth?: string;
  reviewYear?: string;
};

export function groupMaybeReviewedTitleValues<
  TValue extends GroupableMaybeReviewedTitle,
  TSort extends string,
>(
  filteredValues: TValue[],
  showCount: number,
  sort: TSort,
  extraGrouper?: GroupFn<TValue, TSort>,
) {
  return groupTitleValues(
    filteredValues,
    showCount,
    sort,
    createGroupForMaybeReviewedTitleValue(extraGrouper),
  );
}

function createGroupForMaybeReviewedTitleValue<
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
