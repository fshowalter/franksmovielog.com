import type { ReviewContent } from "src/api/reviews";
import { LongFormText } from "src/components/LongFormText";

type Props = Pick<ReviewContent, "content"> & {
  className?: string;
};

export function Content({ content, className }: Props) {
  return (
    <div className={className}>
      <LongFormText
        text={content}
        className="max-w-prose first-letter:leading-[.8] first-letter:text-[#252525] tablet:first-letter:pr-3 desktop:first-letter:text-[64px] [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mt-[6px] [&>p:first-child]:first-letter:pr-2 [&>p:first-child]:first-letter:font-sans-narrow [&>p:first-child]:first-letter:text-[56px] [&>p:first-child]:first-letter:font-bold"
      />
    </div>
  );
}
