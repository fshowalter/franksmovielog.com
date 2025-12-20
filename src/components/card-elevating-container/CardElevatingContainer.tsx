/**
 * Card component
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.children - Content to display in the card
 * @returns Review card shell
 */
export function CardElevatingContainer({
  as = "div",
  children,
  mobilePadding,
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  mobilePadding: boolean;
}): React.JSX.Element {
  const Component = as;

  return (
    <Component
      className={`
        group/card relative mb-1 w-(--card-width) transform-gpu bg-default
        transition-transform duration-500
        tablet:mb-0
        tablet-landscape:has-[a:hover]:-translate-y-2
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
        ${
          mobilePadding
            ? `
              flex flex-col px-[8%] pt-12
              tablet:px-0 tablet:pt-0
            `
            : ""
        }
      `}
    >
      {children}
    </Component>
  );
}
