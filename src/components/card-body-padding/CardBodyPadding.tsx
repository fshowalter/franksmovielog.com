/**
 * Wrapper component that applies consistent padding to card body content.
 * @param props - Component props
 * @param props.children - Content to display with padding
 * @returns Padded container for card body content
 */
export function CardBodyPadding({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div
      className={`
        flex grow flex-col px-1 pb-8
        tablet:px-[8%]
        laptop:pr-[10%] laptop:pl-[8.5%]
      `}
    >
      {children}
    </div>
  );
}
