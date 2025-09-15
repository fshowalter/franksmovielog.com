import { LongFormText } from "~/components/long-form-text/LongFormText";

export function Content({
  className,
  content,
}: {
  className?: string;
  content?: string;
}): React.JSX.Element {
  return (
    <div className={className}>
      <LongFormText
        className={`
          max-w-prose
          first-letter:leading-[.8] first-letter:text-default
          tablet:first-letter:pr-3
          laptop:first-letter:text-[64px]
          dark:font-light
          [&>p:first-child]:first-letter:float-left
          [&>p:first-child]:first-letter:mt-[6px]
          [&>p:first-child]:first-letter:pr-2
          [&>p:first-child]:first-letter:font-sans
          [&>p:first-child]:first-letter:text-[56px]
          [&>p:first-child]:first-letter:font-bold
        `}
        text={content}
      />
    </div>
  );
}
