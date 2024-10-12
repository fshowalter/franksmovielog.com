import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";
import type { WatchlistProgress } from "~/api/watchlistProgress";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { Layout } from "~/components/Layout";

import type { Props as CalloutsProps } from "./Callouts";

import { Callouts } from "./Callouts";
import { Details } from "./Details";

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  progress: {
    collectionDetails: ({
      avatarImageProps: AvatarImageProps | undefined;
    } & WatchlistProgress["collectionDetails"][number])[];
    directorDetails: ({
      avatarImageProps: AvatarImageProps | undefined;
    } & WatchlistProgress["directorDetails"][number])[];
    performerDetails: ({
      avatarImageProps: AvatarImageProps | undefined;
    } & WatchlistProgress["performerDetails"][number])[];
    writerDetails: ({
      avatarImageProps: AvatarImageProps | undefined;
    } & WatchlistProgress["writerDetails"][number])[];
  } & CalloutsProps;
};

export function WatchlistProgress({
  backdropImageProps,
  deck,
  progress,
}: Props): JSX.Element {
  return (
    <Layout className="bg-subtle">
      <Backdrop
        breadcrumb={
          <BreadcrumbLink href="/watchlist/">Watchlist</BreadcrumbLink>
        }
        deck={deck}
        imageProps={backdropImageProps}
        title="Progress"
      />
      <div className="flex flex-col items-center">
        <Callouts
          collectionReviewed={progress.collectionReviewed}
          collectionTotal={progress.collectionTotal}
          directorReviewed={progress.directorReviewed}
          directorTotal={progress.directorTotal}
          performerReviewed={progress.performerReviewed}
          performerTotal={progress.performerTotal}
          reviewed={progress.reviewed}
          total={progress.total}
          writerReviewed={progress.writerReviewed}
          writerTotal={progress.writerTotal}
        />
        <div className="mx-auto flex w-full max-w-screen-max flex-col gap-8 py-16 tablet:px-container desktop:grid desktop:grid-cols-2">
          <Details
            className="col-start-1 row-span-3"
            label="Directors"
            values={progress.directorDetails}
            valueType="director"
          />
          <Details
            label="Performers"
            values={progress.performerDetails}
            valueType="performer"
          />
          <Details
            className="col-start-2 row-start-2"
            label="Writers"
            values={progress.writerDetails}
            valueType="writer"
          />
          <Details
            className="col-start-2 row-start-3"
            label="Collections"
            values={progress.collectionDetails}
            valueType="collection"
          />
        </div>
      </div>
    </Layout>
  );
}
