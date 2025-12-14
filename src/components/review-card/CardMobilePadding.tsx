/**
 * Card component displaying a movie review summary.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.imageConfig - Image sizing configuration
 * @param props.value - Review data to display
 * @param props.variant - Visual style variant ("primary" or "secondary")
 * @returns Review card with still image, title, grade, and excerpt
 */
export function CardMobilePadding({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div
      className={`
        flex h-full flex-col px-[8%] pt-12
        tablet:px-0 tablet:pt-0
      `}
    >
      {children}
    </div>
  );
}
