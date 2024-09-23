import type { WatchlistProgress } from "src/api/watchlistProgress";

import { ProgressRing } from "./ProgressRing";

export interface Props
  extends Pick<
    WatchlistProgress,
    | "reviewed"
    | "total"
    | "directorTotal"
    | "directorReviewed"
    | "performerTotal"
    | "performerReviewed"
    | "writerReviewed"
    | "writerTotal"
    | "collectionReviewed"
    | "collectionTotal"
  > {}

function Callout({
  total,
  reviewed,
  label,
  subLabel,
}: {
  total: number | null;
  reviewed: number | null;
  label: string;
  subLabel?: string;
}): JSX.Element {
  return (
    <div className="flex flex-col items-center first:min-w-full tablet:first:min-w-0">
      <ProgressRing
        width={144}
        height={144}
        total={total ?? 0}
        complete={reviewed ?? 0}
        label={label}
        subLabel={subLabel}
        className="h-auto w-32 tablet:w-36"
      />
      <div className="pt-2 text-center font-sans text-base font-semibold text-muted">
        {reviewed?.toLocaleString()} / {total?.toLocaleString()}
        <div className="font-sans text-sm font-light leading-4">Reviewed</div>
      </div>
    </div>
  );
}

export function Callouts({
  reviewed,
  total,
  directorTotal,
  directorReviewed,
  performerReviewed,
  performerTotal,
  writerReviewed,
  writerTotal,
  collectionReviewed,
  collectionTotal,
}: Props): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-screen-max tablet:mt-12 tablet:px-container">
      <div className="flex w-full flex-wrap justify-center gap-8 px-container py-10">
        <Callout total={total} reviewed={reviewed} label="Total Progress" />
        <Callout
          total={directorTotal}
          reviewed={directorReviewed}
          label="Director"
          subLabel="Titles"
        />
        <Callout
          total={performerTotal}
          reviewed={performerReviewed}
          label="Performer"
          subLabel="Titles"
        />
        <Callout
          total={writerTotal}
          reviewed={writerReviewed}
          label="Writer"
          subLabel="Titles"
        />
        <Callout
          total={collectionTotal}
          reviewed={collectionReviewed}
          label="Collection"
          subLabel="Titles"
        />
      </div>
    </section>
  );
}
