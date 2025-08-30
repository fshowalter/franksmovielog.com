import type { AlltimeStats } from "~/api/alltimeStats";

import { StatsCalloutsGrid } from "~/components/StatsCalloutsGrid";

type Props = Pick<
  AlltimeStats,
  "reviewCount" | "titleCount" | "viewingCount" | "watchlistTitlesReviewedCount"
> & {};

export function Callouts({
  reviewCount,
  titleCount,
  viewingCount,
  watchlistTitlesReviewedCount,
}: Props): React.JSX.Element {
  const stats = [
    { label: "Viewings", value: viewingCount },
    { label: "Movies", value: titleCount },
    { label: "Reviews", value: reviewCount },
    { label: "From Watchlist", value: watchlistTitlesReviewedCount },
  ];

  return (
    <StatsCalloutsGrid
      className={`
        flex flex-wrap justify-center gap-4 px-container
        tablet:gap-6
        laptop:flex-nowrap
      `}
      stats={stats}
    />
  );
}
