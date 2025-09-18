import { RenderedMarkdown } from "~/components/rendered-markdown/RenderedMarkdown";

/**
 * Renders long-form prose text with typography styles.
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.text - HTML text content to render
 * @returns Styled long-form text component
 */
export function LongFormText({
  className,
  text,
}: {
  className?: string;
  text: string | undefined;
}): React.JSX.Element {
  return (
    <RenderedMarkdown
      className={`
        text-md/7 tracking-prose
        tablet:text-xl/8
        ${className ?? ""}
      `}
      text={text}
    />
  );
}
