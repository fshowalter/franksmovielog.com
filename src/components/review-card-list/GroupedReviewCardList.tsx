import { GroupingListItem } from "~/components/grouping-list-item/GroupingListItem";

import { ReviewCardList } from "./ReviewCardList";

/**
 * Displays a grouped list of review cards with show more functionality.
 * @param props - Component props
 * @param props.children - Render function for each item
 * @param props.groupedValues - Map of grouped values
 * @param props.groupItemClassName - Optional CSS class for group items
 * @param props.onShowMore - Handler for show more button
 * @param props.totalCount - Total number of items
 * @param props.visibleCount - Number of visible items
 * @returns Grouped review card list with optional show more button
 */
export function GroupedReviewCardList<T>({
  children,
  groupedValues,
  groupItemClassName,
  ...rest
}: {
  children: (item: T) => React.ReactNode;
  groupedValues: Map<string, Iterable<T>>;
  groupItemClassName?: string;
}): React.JSX.Element {
  return (
    <>
      <ol data-testid="grouped-review-card-list" {...rest}>
        {[...groupedValues].map((groupedValue) => {
          const [group, groupValues] = groupedValue;
          return (
            <GroupingListItem
              className={groupItemClassName}
              groupText={group}
              key={group}
            >
              {" "}
              <div className="tablet:py-6">
                <ReviewCardList>
                  {[...groupValues].map((value) => children(value))}
                </ReviewCardList>
              </div>
            </GroupingListItem>
          );
        })}
      </ol>
    </>
  );
}
