/**
 * Card component
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.children - Content to display in the card
 * @returns Review card shell
 */
export function ReviewCardContainer({
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
        group/card relative mb-1 w-(--review-card-width) transform-gpu
        bg-default transition-transform duration-500
        tablet:mb-0
        tablet-landscape:has-[a:hover]:-translate-y-2
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
      `}
    >
      {children}
    </Component>
  );
}
