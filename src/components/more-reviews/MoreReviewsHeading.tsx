import { SubHeading } from "~/components/sub-heading/SubHeading";

/**
 * Heading component for more reviews sections.
 * @param props - Component props
 * @param props.accentText - Text to display with accent color
 * @param props.as - Heading level element to render
 * @param props.href - Link destination for the heading
 * @param props.text - Main heading text
 * @returns Linked subheading with accent text
 */
export function MoreReviewsHeading({
  accentText,
  as = "h2",
  href,
  text,
}: {
  accentText: string;
  as?: "h2" | "h3" | "h4" | "h5";
  href: string;
  text: string;
}): React.JSX.Element {
  return (
    <SubHeading as={as}>
      <a
        className={`
          relative -mb-1 inline-block transform-gpu pb-1 transition-all
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-bottom-right after:scale-x-0 after:bg-accent
          after:transition-transform after:duration-500
          hover:after:scale-x-100
        `}
        href={href}
      >
        {text} <span className={`text-accent`}>{accentText}</span>
      </a>
    </SubHeading>
  );
}
