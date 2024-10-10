type Props = {
  className?: string;
  complete: number;
  label: string;
  subLabel?: string | undefined;
  total: number;
} & React.SVGProps<SVGSVGElement>;

export function ProgressRing({
  className,
  complete,
  label,
  subLabel,
  total,
  ...rest
}: Props): JSX.Element | null {
  const percent = Math.floor((complete / total) * 100);

  return (
    <svg className={className} viewBox="0 0 36 36" {...rest}>
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill={"none" as const}
        stroke="var(--bg-canvas)"
        strokeWidth={1.8}
      />
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill={"none" as const}
        stroke="var(--bg-progress)"
        strokeDasharray={`${percent}, 100`}
        strokeLinecap="round"
        strokeWidth={1.8}
      />
      <text
        fill="var(--fg-default)"
        fontSize=".5em"
        textAnchor="middle"
        x="18"
        y="17"
      >
        {percent}%
      </text>
      <text
        className="font-sans font-normal"
        fill="var(--fg-default)"
        fontSize=".2em"
        textAnchor="middle"
        x="18"
        y="23"
      >
        {label}
      </text>
      <text
        className="font-sans font-light"
        fill="var(--fg-subtle)"
        fontSize=".2em"
        textAnchor="middle"
        x="18"
        y="27"
      >
        {subLabel}
      </text>
    </svg>
  );
}
