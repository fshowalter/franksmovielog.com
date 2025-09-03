type Props = {
  className?: string;
  stats: StatItem[];
};

type StatItem = {
  label: string;
  value: number;
};

export function CalloutsGrid({ className, stats }: Props): React.JSX.Element {
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

function StatsCallout({
  label,
  value,
}: {
  label: string;
  value: number;
}): React.JSX.Element {
  return (
    <div
      className={`
        flex size-30 flex-col justify-center rounded-full bg-stripe text-center
        text-default shadow-all
        tablet:size-36
      `}
    >
      <div
        className={`
          text-[1.75rem] leading-8
          tablet:text-[2rem]
        `}
      >
        {value.toLocaleString()}
      </div>{" "}
      <div
        className={`
          font-sans text-xxs leading-6 font-light text-muted
          tablet:text-sm
        `}
      >
        {label}
      </div>
    </div>
  );
}
