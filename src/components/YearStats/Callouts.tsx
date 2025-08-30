import type { YearStats } from "~/api/yearStats";

import { StatsCalloutsGrid } from "~/components/StatsCalloutsGrid";

type Props = Pick<YearStats, "newTitleCount" | "titleCount" | "viewingCount">;

export function Callouts({
  newTitleCount,
  titleCount,
  viewingCount,
}: Props): React.JSX.Element {
  const stats = [
    { label: "Viewings", value: viewingCount },
    { label: "Movies", value: titleCount },
    { label: "New Movies", value: newTitleCount },
  ];

  return <StatsCalloutsGrid stats={stats} />;
}
