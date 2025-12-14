import { RenderedMarkdown } from "~/components/rendered-markdown/RenderedMarkdown";

/**
 * Card component displaying a movie review summary.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.imageConfig - Image sizing configuration
 * @param props.value - Review data to display
 * @param props.variant - Visual style variant ("primary" or "secondary")
 * @returns Review card with still image, title, grade, and excerpt
 */
export function CardExcerpt({
  dateLine,
  excerpt,
}: {
  dateLine?: string;
  excerpt: string;
}): React.JSX.Element {
  let excerptWithDateline = excerpt;

  if (dateLine) {
    excerptWithDateline = excerpt.replace(
      "<p>",
      `<p><span data-dateline>${dateLine}&nbsp;&mdash;&nbsp;</span>`,
    );
  }

  return (
    <RenderedMarkdown
      className={`
        leading-normal mb-6 text-lg tracking-prose text-muted
        **:data-dateline:inline-block **:data-dateline:font-sans
        **:data-dateline:text-sm **:data-dateline:leading-[26.25px]
        **:data-dateline:font-normal **:data-dateline:tracking-wider
        **:data-dateline:text-subtle **:data-dateline:uppercase
        **:data-dateline:laptop:tracking-wide
      `}
      text={excerptWithDateline}
    />
  );
}
