import type { ReviewWithContent } from "src/api/reviews";
import { Grade } from "src/components/Grade";
import { LongFormText } from "src/components/LongFormText";
import { ccn } from "src/utils/concatClassNames";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: Date) {
  return dateFormat.format(date);
}

interface Props extends Pick<ReviewWithContent, "grade" | "date" | "content"> {
  className?: string;
}

export function Content({ grade, date, content, className }: Props) {
  return (
    <div className={ccn("flex flex-col gap-y-8", className)}>
      <LongFormText text={content} className="max-w-prose" />
    </div>
  );
}
