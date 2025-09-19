type Props = {
  stats: {
    label: string;
    value: number;
  }[];
};

/**
 * Component for displaying a grid of statistical callouts.
 * @param props - Component props
 * @param props.stats - Array of statistics with label and value
 * @returns Grid of callout cards displaying stats
 */
export function CalloutsGrid({ stats }: Props): React.JSX.Element {
  return (
    <div
      className={`
        flex flex-wrap justify-center gap-4 px-container
        tablet:gap-6
        laptop:flex-nowrap
      `}
    >
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
