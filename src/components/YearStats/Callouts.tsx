import type { JSX } from "react";

import type { YearStats } from "~/api/yearStats";

import { StatsCallout } from "~/components/StatsCallout";

type Props = Pick<YearStats, "newTitleCount" | "titleCount" | "viewingCount">;

export function Callouts({
  newTitleCount,
  titleCount,
  viewingCount,
}: Props): JSX.Element {
  return (
    <div className="flex flex-wrap justify-center gap-6 desktop:flex-nowrap">
      <StatsCallout label="Viewings" value={viewingCount} />
      <StatsCallout label="Movies" value={titleCount} />
      <StatsCallout label="New Movies" value={newTitleCount} />
    </div>
  );
}
