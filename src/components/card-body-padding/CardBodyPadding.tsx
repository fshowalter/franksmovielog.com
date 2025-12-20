/**
 * Card component displaying a movie review summary.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.imageConfig - Image sizing configuration
 * @param props.value - Review data to display
 * @param props.variant - Visual style variant ("primary" or "secondary")
 * @returns Review card with still image, title, grade, and excerpt
 */
export function CardBodyPadding({
  children,
}: {
  children: React.ReactNode;
  paddingClassNames?: string;
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
