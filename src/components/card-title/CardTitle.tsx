/**
 * Card component displaying a movie review summary.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.imageConfig - Image sizing configuration
 * @param props.value - Review data to display
 * @param props.variant - Visual style variant ("primary" or "secondary")
 * @returns Review card with still image, title, grade, and excerpt
 */
export function CardTitle({
  leadingClassNames = "leading-7",
  marginClassNames = "mb-3",
  releaseYear,
  slug,
  textColorClassNames = "text-default",
  textSizeClassNames = "text-2.5xl tablet:text-2xl laptop:text-2.5xl",
  title,
}: {
  leadingClassNames?: string;
  marginClassNames?: string;
  releaseYear: string;
  slug?: string;
  textColorClassNames?: string;
  textSizeClassNames?: string;
  title: string;
}): React.JSX.Element {
  const releaseYearComponent = (
    <span className={`text-sm leading-none font-normal text-muted`}>
      {releaseYear}
    </span>
  );

  if (slug) {
    return (
      <a
        className={`
          block font-medium transition-all duration-500
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
          hover:text-accent
          ${textSizeClassNames}
          ${leadingClassNames}
          ${textColorClassNames}
          ${marginClassNames}
        `}
        href={`/reviews/${slug}/`}
      >
        {title}&nbsp;{releaseYearComponent}
      </a>
    );
  }

  return (
    <div
      className={`
        font-medium
        ${textSizeClassNames}
        ${leadingClassNames}
        ${textColorClassNames}
        ${marginClassNames}
      `}
    >
      {title}&nbsp;{releaseYearComponent}
    </div>
  );
}
