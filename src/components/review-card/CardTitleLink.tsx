import { CardTitle } from "./CardTitle";

/**
 * Card component displaying a movie review summary.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.imageConfig - Image sizing configuration
 * @param props.value - Review data to display
 * @param props.variant - Visual style variant ("primary" or "secondary")
 * @returns Review card with still image, title, grade, and excerpt
 */
export function CardTitleLink({
  leadingClassNames = "leading-7",
  releaseYear,
  slug,
  textSizeClassNames = "text-2.5xl tablet:text-2xl laptop:text-2.5xl",
  title,
}: {
  leadingClassNames?: string;
  releaseYear: string;
  slug: string;
  textSizeClassNames?: string;
  title: string;
}): React.JSX.Element {
  return (
    <a
      className={`
        mb-3 block transition-all duration-500
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        hover:text-accent!
      `}
      href={`/reviews/${slug}/`}
    >
      <CardTitle
        leadingClassNames={leadingClassNames}
        releaseYear={releaseYear}
        textSizeClassNames={textSizeClassNames}
        title={title}
      />
    </a>
  );
}
