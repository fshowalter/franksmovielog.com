import { RenderedMarkdown } from "./RenderedMarkdown";

export function LongFormText({
  otherClasses,
  text,
  textClasses = "text-md/7 tablet:text-xl/8",
  trackingClasses = "tracking-prose",
}: {
  otherClasses?: string;
  text: string | undefined;
  textClasses?: string;
  trackingClasses?: string;
}) {
  return (
    <RenderedMarkdown
      className={`
        ${textClasses}
        ${trackingClasses}
        ${otherClasses ?? ""}
      `}
      text={text}
    />
  );
}
