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
      `<p><span class="inline-block font-sans text-xs uppercase font-normal leading-[26.25px] tracking-wide text-subtle">${dateLine}&nbsp;<span class="font-light">&mdash;</span>&nbsp;</span>`,
    );
  }

  return (
    <RenderedMarkdown
      className={`leading-normal mb-6 text-lg tracking-prose text-muted`}
      text={excerptWithDateline}
    />
  );
}
