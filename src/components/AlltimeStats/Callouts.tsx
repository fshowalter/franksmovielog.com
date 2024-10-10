import type { AlltimeStats } from "src/api/alltimeStats";

import { StatsCallout } from "src/components/StatsCallout";

interface Props
  extends Pick<
    AlltimeStats,
    | "reviewCount"
    | "titleCount"
    | "viewingCount"
    | "watchlistTitlesReviewedCount"
  > {}

export function Callouts({
  reviewCount,
  titleCount,
  viewingCount,
  watchlistTitlesReviewedCount,
}: Props): JSX.Element {
  return (
    <div className="flex flex-wrap justify-center gap-6 desktop:flex-nowrap">
      <StatsCallout label="Viewings" value={viewingCount} />
      <StatsCallout label="Movies" value={titleCount} />
      <StatsCallout label="Reviews" value={reviewCount} />
      <StatsCallout
        label="From Watchlist"
        value={watchlistTitlesReviewedCount}
      />
    </div>
  );
}
