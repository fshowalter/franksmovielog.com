import type { GroupFn } from "~/groupers/groupValues";

import type { GroupableTitle } from "./groupTitleValues";

import { groupTitleValues } from "./groupTitleValues";

type GroupableReviewedTitle = GroupableTitle & {
  grade: string;
  reviewMonth?: string;
  reviewYear: string;
};

export function groupReviewedTitleValues<
  TValue extends GroupableReviewedTitle,
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
    createGroupForReviewedTitleValue(extraGrouper),
  );
}

function createGroupForReviewedTitleValue<
  TValue extends GroupableReviewedTitle,
  TSort extends string,
>(grouper: GroupFn<TValue, TSort> = () => "") {
  return function groupForTitleValue(value: TValue, sort: TSort) {
    switch (sort) {
      case "grade-asc":
      case "grade-desc": {
        return value.grade;
      }
      case "review-date-asc":
      case "review-date-desc": {
        if (value.reviewMonth) {
          return `${value.reviewMonth} ${value.reviewYear}`;
        }
        return value.reviewYear;
      }
      default: {
        return grouper(value, sort);
      }
    }
  };
}
