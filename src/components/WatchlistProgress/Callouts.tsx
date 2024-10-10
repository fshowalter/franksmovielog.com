import type { WatchlistProgress } from "src/api/watchlistProgress";

import { ProgressRing } from "./ProgressRing";

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

function Callout({
  label,
  reviewed,
  subLabel,
  total,
}: {
  label: string;
  reviewed: null | number;
  subLabel?: string;
  total: null | number;
}): JSX.Element {
  return (
    <div className="flex flex-col items-center first:min-w-full tablet:first:min-w-0">
      <ProgressRing
        className="h-auto w-32 tablet:w-36"
        complete={reviewed ?? 0}
        height={144}
        label={label}
        subLabel={subLabel}
        total={total ?? 0}
        width={144}
      />
      <div className="pt-2 text-center font-sans text-base font-semibold text-muted">
        {reviewed?.toLocaleString()} / {total?.toLocaleString()}
        <div className="font-sans text-sm font-light leading-4">Reviewed</div>
      </div>
    </div>
  );
}

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
}: Props): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-screen-max tablet:mt-12 tablet:px-container">
      <div className="flex w-full flex-wrap justify-center gap-8 px-container py-10">
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
