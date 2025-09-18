import { GroupingListItem } from "~/components/grouping-list-item/GroupingListItem";

import { PosterList } from "./PosterList";

/**
 * Displays a grouped list of poster items with show more functionality.
 * @param props - Component props
 * @param props.children - Render function for each item
 * @param props.groupedValues - Map of grouped values
 * @param props.groupItemClassName - Optional CSS class for group items
 * @param props.onShowMore - Handler for show more button
 * @param props.totalCount - Total number of items
 * @param props.visibleCount - Number of visible items
 * @returns Grouped poster list with optional show more button
 */
export function GroupedPosterList<T>({
  children,
  groupedValues,
  groupItemClassName,
  onShowMore,
  totalCount,
  visibleCount,
  ...rest
}: {
  children: (item: T) => React.ReactNode;
  groupedValues: Map<string, Iterable<T>>;
  groupItemClassName?: string;
  onShowMore?: () => void;
  totalCount: number;
  visibleCount: number;
}): React.JSX.Element {
  return (
    <>
      <ol data-testid="grouped-poster-list" {...rest}>
        {[...groupedValues].map((groupedValue) => {
          const [group, groupValues] = groupedValue;
          return (
            <GroupingListItem
              className={groupItemClassName}
              groupText={group}
              key={group}
            >
              {" "}
              <div className="tablet:-mx-6">
                <PosterList>
                  {[...groupValues].map((value) => children(value))}
                </PosterList>
              </div>
            </GroupingListItem>
          );
        })}
      </ol>
      {onShowMore && (
        <div className="flex flex-col items-center px-container py-10">
          {totalCount > visibleCount && (
            <button
              className={`
                mx-auto w-full max-w-button transform-gpu cursor-pointer
                rounded-md bg-canvas py-5 text-center font-sans text-sm
                font-bold tracking-wide uppercase shadow-all
                transition-transform
                hover:scale-105 hover:drop-shadow-lg
              `}
              onClick={onShowMore}
              type="button"
            >
              Show More
            </button>
          )}
        </div>
      )}
    </>
  );
}
