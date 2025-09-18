import type { AvatarImageProps } from "~/api/avatars";
import type { WatchlistProgress } from "~/api/watchlist";

import { WatchlistProgressCallouts } from "./WatchlistProgressCallouts";
import { WatchlistProgressForGroup } from "./WatchlistProgressForGroup";

/**
 * Props for the WatchlistProgress component.
 */
export type WatchlistProgressProps = {
  progress: React.ComponentProps<typeof WatchlistProgressCallouts> & {
    collectionDetails: (WatchlistProgress["collectionDetails"][number] & {
      avatarImageProps: AvatarImageProps | undefined;
    })[];
    directorDetails: (WatchlistProgress["directorDetails"][number] & {
      avatarImageProps: AvatarImageProps | undefined;
    })[];
    performerDetails: (WatchlistProgress["performerDetails"][number] & {
      avatarImageProps: AvatarImageProps | undefined;
    })[];
    writerDetails: (WatchlistProgress["writerDetails"][number] & {
      avatarImageProps: AvatarImageProps | undefined;
    })[];
  };
};

/**
 * Component displaying watchlist progress statistics and details.
 * @param props - Component props
 * @param props.progress - Progress data including totals and details by category
 * @returns Watchlist progress component with callouts and grouped details
 */
export function WatchlistProgress({
  progress,
}: WatchlistProgressProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center bg-subtle">
      <WatchlistProgressCallouts
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
      <div
        className={`
            mx-auto flex w-full max-w-(--breakpoint-desktop) flex-col gap-x-8
            gap-y-20 py-16
            tablet:px-container
            laptop:grid laptop:grid-cols-2
          `}
      >
        <WatchlistProgressForGroup
          className="col-start-1 row-span-3"
          label="Directors"
          values={progress.directorDetails}
          valueType="director"
        />
        <WatchlistProgressForGroup
          label="Performers"
          values={progress.performerDetails}
          valueType="performer"
        />
        <WatchlistProgressForGroup
          className="col-start-2 row-start-2"
          label="Writers"
          values={progress.writerDetails}
          valueType="writer"
        />
        <WatchlistProgressForGroup
          className="col-start-2 row-start-3"
          label="Collections"
          values={progress.collectionDetails}
          valueType="collection"
        />
      </div>
    </div>
  );
}
