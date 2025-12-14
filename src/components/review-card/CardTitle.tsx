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
  releaseYear,
  slug,
  title,
}: {
  releaseYear: string;
  slug?: string;
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
          mb-3 block text-2.5xl leading-7 font-medium text-default
          transition-all duration-500
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
          hover:text-accent
          tablet:text-2xl
          laptop:text-2.5xl
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
        mb-3 block text-2.5xl leading-7 font-medium text-subtle
        tablet:text-2xl
        laptop:text-2.5xl
      `}
    >
      {title}&nbsp;{releaseYearComponent}
    </div>
  );
}
