/**
 * Card component
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.children - Content to display in the card
 * @returns Review card shell
 */
export function PlaceholderCardContainer({
  as = "div",
  children,
}: {
  as?: React.ElementType;
  children: React.ReactNode;
}): React.JSX.Element {
  const Component = as;

  return (
    <Component
      className={`
        group/card relative mb-1 w-(--review-card-width,100%) bg-default/50
        tablet:mb-0
      `}
    >
      {children}
    </Component>
  );
}
