/**
 * Component that displays eyebrow text above a card title.
 * @param props - Component props
 * @param props.children - Eyebrow content to display
 * @returns Styled eyebrow text element
 */
export function CardEyebrow({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div
      className={`
        mb-3 font-sans text-xs/4 font-normal tracking-wider text-subtle
        uppercase
        laptop:tracking-wide
      `}
    >
      {children}
    </div>
  );
}
