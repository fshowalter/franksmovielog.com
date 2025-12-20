/**
 * Component that displays a movie title with release year.
 * Renders as a link if slug is provided, otherwise as plain text.
 * @param props - Component props
 * @param props.leadingClassNames - Custom CSS classes for line height (defaults to "leading-7")
 * @param props.marginClassNames - Custom CSS classes for margin (defaults to "mb-3")
 * @param props.releaseYear - The movie's release year
 * @param props.slug - Optional review slug for linking to review page
 * @param props.textColorClassNames - Custom CSS classes for text color (defaults to "text-default")
 * @param props.textSizeClassNames - Custom CSS classes for text size (defaults to responsive sizing)
 * @param props.title - The movie title
 * @returns Movie title element with release year
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
