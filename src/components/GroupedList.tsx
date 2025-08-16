import type { JSX } from "react";

import { Button } from "./Button";
import { GroupingListItem } from "./GroupingListItem";

export function GroupedList<T>({
  children,
  className,
  groupedValues,
  groupItemClassName,
  isGrid = true,
  onShowMore,
  totalCount,
  visibleCount,
  ...rest
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
    <>
      <ol
        className={`
          ${className ?? ""}
        `}
        {...rest}
      >
        {[...groupedValues].map((groupedValue) => {
          const [group, groupValues] = groupedValue;
          return (
            <GroupingListItem
              className={groupItemClassName}
              groupText={group}
              key={group}
            >
              <ol
                className={
                  isGrid
                    ? `
                      grid-cols-[repeat(auto-fill,minmax(calc(100%_/_var(--grouped-list-number-of-columns,1)),1fr))]
                      tablet:-mx-6 tablet:grid tablet:gap-y-12
                    `
                    : ""
                }
              >
                {[...groupValues].map((value) => children(value))}
              </ol>
            </GroupingListItem>
          );
        })}
      </ol>
      {onShowMore && (
        <div className="flex flex-col items-center px-container py-10">
          {totalCount > visibleCount && (
            <Button onClick={onShowMore}>Show More</Button>
          )}
        </div>
      )}
    </>
  );
}
