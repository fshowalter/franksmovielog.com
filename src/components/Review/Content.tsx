import type { ReviewContent } from "~/api/reviews";

import { LongFormText } from "~/components/LongFormText";

type Props = Pick<ReviewContent, "content"> & {
  className?: string;
};

export function Content({ className, content }: Props) {
  return (
    <div className={className}>
      <LongFormText
        className="max-w-prose first-letter:leading-[.8] first-letter:text-default tablet:first-letter:pr-3 desktop:first-letter:text-[64px] [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mt-[6px] [&>p:first-child]:first-letter:pr-2 [&>p:first-child]:first-letter:font-sans [&>p:first-child]:first-letter:text-[56px] [&>p:first-child]:first-letter:font-bold"
        text={content}
      />
    </div>
  );
}
