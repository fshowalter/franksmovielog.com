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
    <>
      <ProgressRing
        width={144}
        height={144}
        total={total ?? 0}
        complete={reviewed ?? 0}
        label={label}
        subLabel={subLabel}
        className="h-auto w-32 tablet:w-36"
      />
      <div className="pt-2 text-center font-sans-bold text-base text-muted">
        <div>
          {reviewed?.toLocaleString()}/{total?.toLocaleString()}
        </div>
        <div className="font-sans-book text-sm leading-4">Reviewed</div>
      </div>
    </>
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
      <div className="flex w-full flex-wrap justify-center gap-x-8 px-container py-10">
        <div className="flex min-w-full flex-col items-center pt-8 tablet:min-w-0">
          <Callout total={total} reviewed={reviewed} label="Total Progress" />
        </div>
        <div>
          <div className="spacer-y-8" />
          <Callout
            total={directorTotal}
            reviewed={directorReviewed}
            label="Director"
            subLabel="Titles"
          />
        </div>
        <div>
          <div className="spacer-y-8" />
          <Callout
            total={performerTotal}
            reviewed={performerReviewed}
            label="Performer"
            subLabel="Titles"
          />
        </div>
        <div>
          <div className="spacer-y-8" />
          <Callout
            total={writerTotal}
            reviewed={writerReviewed}
            label="Writer"
            subLabel="Titles"
          />
        </div>
        <div>
          <div className="spacer-y-8" />
          <Callout
            total={collectionTotal}
            reviewed={collectionReviewed}
            label="Collection"
            subLabel="Titles"
          />
        </div>
      </div>
    </section>
  );
}
