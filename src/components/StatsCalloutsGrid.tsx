import type { JSX } from "react";

import { StatsCallout } from "~/components/StatsCallout";

type Props = {
  className?: string;
  stats: StatItem[];
};

type StatItem = {
  label: string;
  value: number;
};

export function StatsCalloutsGrid({ className, stats }: Props): JSX.Element {
  const defaultClassName = `
    flex flex-wrap justify-center gap-6 px-container
    laptop:flex-nowrap
  `;

  return (
    <div className={className || defaultClassName}>
      {stats.map((stat) => (
        <StatsCallout key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}