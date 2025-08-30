import type { WatchlistProgress } from "~/api/watchlistProgress";

export type Props = Pick<
  WatchlistProgress,
  | "collectionReviewed"
  | "collectionTotal"
  | "directorReviewed"
  | "directorTotal"
  | "performerReviewed"
  | "performerTotal"
  | "reviewed"
  | "total"
  | "writerReviewed"
  | "writerTotal"
>;

type ProgressRingProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
  complete: number;
  label: string;
  subLabel?: string | undefined;
  total: number;
};

export function Callouts({
  collectionReviewed,
  collectionTotal,
  directorReviewed,
  directorTotal,
  performerReviewed,
  performerTotal,
  reviewed,
  total,
  writerReviewed,
  writerTotal,
}: Props): React.JSX.Element {
  return (
    <div
      className={`
        mx-auto w-full max-w-(--breakpoint-desktop)
        tablet:mt-12 tablet:px-container
      `}
    >
      <div
        className={`
          flex w-full flex-wrap justify-center gap-8 px-container py-10
        `}
      >
        <Callout label="Total Progress" reviewed={reviewed} total={total} />
        <Callout
          label="Director"
          reviewed={directorReviewed}
          subLabel="Titles"
          total={directorTotal}
        />
        <Callout
          label="Performer"
          reviewed={performerReviewed}
          subLabel="Titles"
          total={performerTotal}
        />
        <Callout
          label="Writer"
          reviewed={writerReviewed}
          subLabel="Titles"
          total={writerTotal}
        />
        <Callout
          label="Collection"
          reviewed={collectionReviewed}
          subLabel="Titles"
          total={collectionTotal}
        />
      </div>
    </div>
  );
}

function Callout({
  label,
  reviewed,
  subLabel,
  total,
}: {
  label: string;
  reviewed: number;
  subLabel?: string;
  total: number;
}): React.JSX.Element {
  return (
    <div
      className={`
        flex flex-col items-center
        first:min-w-full
        tablet:first:min-w-0
      `}
    >
      <ProgressRing
        className={`
          h-auto w-32
          tablet:w-36
        `}
        complete={reviewed}
        height={144}
        label={label}
        subLabel={subLabel}
        total={total}
        width={144}
      />
      <div
        className={`
          pt-2 text-center font-sans text-base font-semibold text-muted
        `}
      >
        {reviewed.toLocaleString()} / {total.toLocaleString()}
        <div
          className={`
            font-sans text-sm leading-4 font-normal tracking-prose text-subtle
          `}
        >
          Reviewed
        </div>
      </div>
    </div>
  );
}

function ProgressRing({
  className,
  complete,
  label,
  subLabel,
  total,
  ...rest
}: ProgressRingProps): React.JSX.Element {
  const percent = Math.floor((complete / total) * 100);

  return (
    <svg className={className} viewBox="0 0 36 36" {...rest}>
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill={"none" as const}
        stroke="var(--bg-canvas)"
        strokeWidth={1.8}
      />
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill={"none" as const}
        stroke="var(--bg-progress)"
        strokeDasharray={`${percent}, 100`}
        strokeLinecap="round"
        strokeWidth={1.8}
      />
      <text
        fill="var(--fg-default)"
        fontSize=".5em"
        textAnchor="middle"
        x="18"
        y="17"
      >
        {percent}%
      </text>
      <text
        className="font-sans"
        fill="var(--fg-default)"
        fontSize=".2em"
        textAnchor="middle"
        x="18"
        y="23"
      >
        {label}
      </text>
      <text
        className="font-sans"
        fill="var(--fg-subtle)"
        fontSize=".2em"
        textAnchor="middle"
        x="18"
        y="27"
      >
        {subLabel}
      </text>
    </svg>
  );
}
