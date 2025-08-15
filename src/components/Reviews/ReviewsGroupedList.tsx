import type { JSX } from "react";

import { GroupedList } from "~/components/GroupedList";

export function ReviewsGroupedList<T>({
  children,
  groupedValues,
  onShowMore,
  totalCount,
  visibleCount,
}: {
  children: (item: T) => React.ReactNode;
  className?: string;
  groupedValues: Map<string, Iterable<T>>;
  groupItemClassName?: string;
  isGrid?: boolean;
  onShowMore?: () => void;
  totalCount: number;
  visibleCount: number;
}): JSX.Element {
  return (
    <div className="@container/list">
      <GroupedList
        className={`
          bg-default
          [--grouped-list-number-of-columns:2]
          @min-[calc(298px_*_2)]/list:[--grouped-list-number-of-columns:3]
          @min-[calc(298px_*_3)]/list:[--grouped-list-number-of-columns:4]
          @min-[calc(298px_*_4)]/list:[--grouped-list-number-of-columns:5]
          @min-[calc(298px_*_5)]/list:[--grouped-list-number-of-columns:6]
        `}
        data-testid="list"
        groupedValues={groupedValues}
        onShowMore={onShowMore}
        totalCount={totalCount}
        visibleCount={visibleCount}
      >
        {children}
      </GroupedList>
    </div>
  );
}
