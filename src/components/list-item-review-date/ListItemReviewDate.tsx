/**
 * Displays a formatted review date in a list item.
 * @param props - Component props
 * @param props.displayDate - The formatted date string to display
 * @returns Styled review date text
 */
export function ListItemReviewDate({
  displayDate,
}: {
  displayDate: string;
}): React.JSX.Element {
  return (
    <div
      className={`font-sans text-[13px] leading-4 tracking-prose text-subtle`}
    >
      {displayDate}
    </div>
  );
}
