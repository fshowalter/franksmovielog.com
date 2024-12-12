import type { JSX } from "react";

import type { AlltimeStats } from "~/api/alltimeStats";

import { StatsCallout } from "~/components/StatsCallout";

type Props = Pick<
  AlltimeStats,
  "reviewCount" | "titleCount" | "viewingCount" | "watchlistTitlesReviewedCount"
> & {};

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
