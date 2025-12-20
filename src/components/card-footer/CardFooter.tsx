/**
 * Card component displaying a movie genres.
 * @param props - Component props
 * @param props.genres - The genres to display
 * @returns Styled genres component
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
