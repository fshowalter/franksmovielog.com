import type { JSX } from "react";

import { Button } from "./Button";

export function GroupedList<T>({
  children,
  className,
  groupedValues,
  groupItemClassName,
  onShowMore,
  stickyGroupHeaders = false,
  totalCount,
  visibleCount,
  ...rest
}: {
  children: (item: T) => React.ReactNode;
  className?: string;
  groupedValues: Map<string, Iterable<T>>;
  groupItemClassName?: string;
  onShowMore?: () => void;
  stickyGroupHeaders?: boolean;
  totalCount: number;
  visibleCount: number;
}): JSX.Element {
  return (
    <>
      <ol className={className ?? ""} {...rest}>
        {[...groupedValues].map((groupedValue, index) => {
          const [group, groupValues] = groupedValue;

          return (
            <GroupingListItem
              className={groupItemClassName ?? groupItemClassName}
              groupText={group}
              key={group}
              stickyHeader={stickyGroupHeaders}
              zIndex={index + 1}
            >
              <ol>{[...groupValues].map((value) => children(value))}</ol>
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

function GroupingListItem({
  children,
  className,
  groupText,
  stickyHeader,
  zIndex,
}: {
  children: React.ReactNode;
  className?: string;
  groupText: string;
  stickyHeader: boolean;
  zIndex: number;
}) {
  return (
    <li
      className={`
        block
        ${className ?? ""}
      `}
      id={groupText}
    >
      <div
        className={`
          pt-0 text-md
          ${stickyHeader ? "sticky top-0" : ""}
        `}
        style={{ zIndex: zIndex }}
      >
        <div
          className={`
            max-w-(--breakpoint-desktop) bg-subtle px-container py-8 text-xl
            leading-8
            tablet:px-4
          `}
        >
          {groupText}
        </div>
      </div>
      <div className="bg-subtle">{children}</div>
    </li>
  );
}
