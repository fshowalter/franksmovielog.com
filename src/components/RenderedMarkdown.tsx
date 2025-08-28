import type { ElementType, JSX } from "react";

export function RenderedMarkdown({
  as = "div",
  className,
  text,
}: {
  as?: ElementType;
  className?: string;
  text: string | undefined;
}): false | JSX.Element {
  if (!text) {
    return false;
  }

  const Component = as;

  return (
    <Component
      className={`
        rendered-markdown
        ${className ?? ""}
      `}
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  );
}
