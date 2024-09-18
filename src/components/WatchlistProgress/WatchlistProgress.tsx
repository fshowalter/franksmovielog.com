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
      <div className="flex flex-col items-center">
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
        <div className="mx-auto w-full max-w-screen-max gap-8 py-16 tablet:px-container desktop:grid desktop:grid-cols-2">
          <Details
            label="Director Progress"
            valueType="director"
            values={progress.directorDetails}
            className="col-start-1 row-span-3"
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
            className="col-start-2 row-start-2"
          />
          <Details
            label="Collection Progress"
            valueType="collection"
            values={progress.collectionDetails}
            className="col-start-2 row-start-3"
          />
        </div>
      </div>
    </Layout>
  );
}
