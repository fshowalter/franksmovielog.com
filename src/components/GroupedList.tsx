import type { JSX } from "react";

import { Button } from "./Button";

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
      <ol className={className ?? ""} {...rest}>
        {[...groupedValues].map((groupedValue, index) => {
          const [group, groupValues] = groupedValue;

          return (
            <GroupingListItem
              className={groupItemClassName ?? groupItemClassName}
              groupText={group}
              key={group}
              zIndex={index + 1}
            >
              <ol
                className={
                  isGrid
                    ? `
                      tablet:-mx-6 tablet:grid
                      tablet:grid-cols-[repeat(auto-fill,minmax(33%,1fr))]
                      tablet:gap-y-12
                      min-[872px]:grid-cols-[repeat(auto-fill,minmax(25%,1fr))]
                      laptop:grid-cols-[repeat(auto-fill,minmax(20%,1fr))]
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

function GroupingListItem({
  children,
  className,
  groupText,
  zIndex,
}: {
  children: React.ReactNode;
  className?: string;
  groupText: string;
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
      <div className={`pt-0 text-md`} style={{ zIndex: zIndex }}>
        <div
          className={`
            max-w-(--breakpoint-desktop) bg-subtle px-container py-8 text-xl
            leading-8
            tablet:px-1
          `}
        >
          {groupText}
        </div>
      </div>
      <div className="bg-subtle">{children}</div>
    </li>
  );
}
