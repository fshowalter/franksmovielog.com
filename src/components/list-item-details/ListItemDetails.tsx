/**
 * Container for list item detail components.
 * @param props - Component props
 * @param props.children - Detail components to display
 * @returns Flexbox container for list item details
 */
export function ListItemDetails({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div
      className={`
        flex grow flex-col items-start gap-y-2
        tablet:mt-2 tablet:w-full tablet:px-1
      `}
    >
      {children}
    </div>
  );
}
