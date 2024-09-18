import type { BackdropImageProps } from "src/api/backdrops";
import type { WatchlistProgress } from "src/api/watchlistProgress";

import { Backdrop } from "../Backdrop";
import { Layout } from "../Layout";
import type { Props as CalloutsProps } from "./Callouts";
import { Callouts } from "./Callouts";
import { Details } from "./Details";

export type Props = {
  progress: Pick<
    WatchlistProgress,
    | "collectionDetails"
    | "directorDetails"
    | "writerDetails"
    | "performerDetails"
  > &
    CalloutsProps;
  backdropImageProps: BackdropImageProps;
};

export function WatchlistProgress({
  progress,
  backdropImageProps,
}: Props): JSX.Element {
  console.log(progress);
  return (
    <Layout className="bg-subtle">
      <Backdrop
        imageProps={backdropImageProps}
        title="Progress"
        breadcrumb={<a href="/watchlist/">Watchlist</a>}
        alt='Darth Vadar in "Star Wars (1977)'
        deck='"I find your lack of faith disturbing."'
      />
      <div className="flex flex-col items-center pt-10">
        <Callouts
          total={progress.total}
          reviewed={progress.reviewed}
          writerReviewed={progress.writerReviewed}
          writerTotal={progress.writerTotal}
          directorReviewed={progress.directorReviewed}
          directorTotal={progress.directorTotal}
          performerReviewed={progress.performerReviewed}
          performerTotal={progress.performerTotal}
          collectionReviewed={progress.collectionReviewed}
          collectionTotal={progress.collectionTotal}
        />
        <div className="mx-auto flex w-full max-w-screen-max flex-wrap items-start justify-center gap-8 py-16 tablet:px-container">
          <Details
            label="Director Progress"
            valueType="director"
            values={progress.directorDetails}
          />
          <Details
            label="Performer Progress"
            valueType="performer"
            values={progress.performerDetails}
          />
          <Details
            label="Writer Progress"
            valueType="writer"
            values={progress.writerDetails}
          />
          <Details
            label="Collection Progress"
            valueType="collection"
            values={progress.collectionDetails}
          />
        </div>
      </div>
    </Layout>
  );
}
