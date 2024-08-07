import type { ElementType } from "react";
import { ccn } from "src/utils/concatClassNames";

export function RenderedMarkdown({
  className,
  as = "div",
  text,
}: {
  text: string | null;
  className?: string;
  as?: ElementType;
}): JSX.Element | null {
  if (!text) {
    return null;
  }

  const Component = as;

  return (
    <Component
      className={ccn("rendered-markdown font-light", className)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  );
}
