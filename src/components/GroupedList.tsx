import { Button } from "./Button";

export function GroupedList<T>({
  groupedValues,
  visibleCount,
  totalCount,
  onShowMore,
  children,
  className,
  ...rest
}: {
  groupedValues: Map<string, Iterable<T>>;
  visibleCount: number;
  totalCount: number;
  onShowMore: () => void;
  children: (item: T) => React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <>
      <ol className={className} {...rest}>
        {[...groupedValues].map((groupedValue, index) => {
          const [group, groupValues] = groupedValue;

          return (
            <GroupingListItem groupText={group} key={group} zIndex={index + 1}>
              <ol>{[...groupValues].map(children)}</ol>
            </GroupingListItem>
          );
        })}
      </ol>
      <div className="flex flex-col items-center px-container-base py-10">
        {totalCount > visibleCount && (
          <Button
            onClick={onShowMore}
            className="mx-auto w-full max-w-[430px] bg-default px-container-base py-5 text-center font-sans-narrow text-sm uppercase tracking-[.6px] hover:bg-inverse hover:text-inverse"
          >
            Show More
          </Button>
        )}
      </div>
    </>
  );
}

function GroupingListItem({
  groupText,
  children,
  zIndex,
}: {
  groupText: string;
  children: React.ReactNode;
  zIndex: number;
}) {
  return (
    <li className="first-of-type:shadow-top block bg-subtle">
      <div style={{ zIndex: zIndex }} className="pt-0 text-md">
        <div className="max-w-screen-max px-container-base py-8 text-xl leading-8 tablet:bg-subtle tablet:px-4">
          {groupText}
        </div>
      </div>
      {children}
    </li>
  );
}
