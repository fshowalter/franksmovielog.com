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
        className="max-w-prose first-letter:float-left first-letter:mt-[6px] first-letter:pr-2 first-letter:font-sans-narrow-bold first-letter:text-[56px] first-letter:leading-[.8] first-letter:text-[#252525] tablet:first-letter:pr-3 desktop:first-letter:text-[64px]"
      />
    </div>
  );
}
