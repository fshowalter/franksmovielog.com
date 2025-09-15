import { GroupingListItem } from "~/components/grouping-list-item/GroupingListItem";

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
