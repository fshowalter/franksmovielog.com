import { ccn } from "src/utils/concatClassNames";

import { RenderedMarkdown } from "./RenderedMarkdown";

export function LongFormText({
  className,
  text,
}: {
  className?: string;
  text: null | string;
}) {
  return (
    <RenderedMarkdown
      className={ccn("text-md/7 tracking-prose tablet:text-xl/8", className)}
      text={text}
    />
  );
}
