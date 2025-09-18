import { GroupingListItem } from "~/components/grouping-list-item/GroupingListItem";

/**
 * List component that displays avatars grouped by categories.
 * @param props - Component props
 * @param props.children - Render function for individual items
 * @param props.className - Optional CSS classes for the list
 * @param props.groupedValues - Map of group names to items
 * @param props.groupItemClassName - Optional CSS classes for group items
 * @returns Grouped avatar list element
 */
export function GroupedAvatarList<T>({
  children,
  className,
  groupedValues,
  groupItemClassName,
  ...rest
}: {
  children: (item: T) => React.ReactNode;
  className?: string;
  groupedValues: Map<string, Iterable<T>>;
  groupItemClassName?: string;
}): React.JSX.Element {
  return (
    <>
      <ol
        className={`
          ${className ?? ""}
        `}
        data-testid="grouped-avatar-list"
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
              <ol>{[...groupValues].map((value) => children(value))}</ol>
            </GroupingListItem>
          );
        })}
      </ol>
    </>
  );
}
