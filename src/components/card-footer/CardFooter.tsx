/**
 * Component that displays footer content at the bottom of a card.
 * @param props - Component props
 * @param props.children - Footer content to display
 * @returns Styled footer element
 */
export function CardFooter({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div
      className={`
        mt-auto font-sans text-xs leading-4 tracking-wider text-subtle
        laptop:tracking-wide
      `}
    >
      {children}
    </div>
  );
}
