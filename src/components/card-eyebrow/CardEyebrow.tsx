/**
 * Card component displaying a movie review summary.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.imageConfig - Image sizing configuration
 * @param props.value - Review data to display
 * @param props.variant - Visual style variant ("primary" or "secondary")
 * @returns Review card with still image, title, grade, and excerpt
 */
export function CardEyebrow({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div
      className={`
        mb-3 font-sans text-xs leading-4 font-normal tracking-wider text-subtle
        uppercase
        laptop:tracking-wide
      `}
    >
      {children}
    </div>
  );
}
