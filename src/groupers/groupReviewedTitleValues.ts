import type { GroupFn } from "~/groupers/groupValues";
import type { SortableReviewedTitle } from "~/sorters/createReviewedTitleSorter";

import { groupTitleValues } from "./groupTitleValues";

export function selectGroupedReviewedTitleValues<
  TValue extends SortableReviewedTitle,
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
  TValue extends SortableReviewedTitle,
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
