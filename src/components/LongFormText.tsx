import { ccn } from "src/utils/concatClassNames";

import { RenderedMarkdown } from "./RenderedMarkdown";

export function LongFormText({
  text,
  className,
}: {
  text: string | null;
  className?: string;
}) {
  return (
    <RenderedMarkdown
      text={text}
      className={ccn("text-md/7 tracking-prose tablet:text-xl/8", className)}
    />
  );
}
