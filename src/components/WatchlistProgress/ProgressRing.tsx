interface Props extends React.SVGProps<SVGSVGElement> {
  total: number;
  complete: number;
  label: string;
  subLabel?: string | undefined;
}

export function ProgressRing({
  total,
  complete,
  label,
  subLabel,
  ...rest
}: Props): JSX.Element | null {
  if (total === 0) {
    return null;
  }

  const percent = Math.floor((complete / total) * 100);

  return (
    <svg className="font-sans" viewBox="0 0 36 36" {...rest}>
      <path
        stroke="var(--bg-canvas)"
        strokeWidth={3.8}
        fill={"none" as const}
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        stroke="var(--bg-progress)"
        strokeLinecap="round"
        fill="none"
        strokeWidth={2.8}
        strokeDasharray={`${percent}, 100`}
      />
      <text
        x="18"
        y="17"
        fill="var(--fg-default)"
        textAnchor="middle"
        fontSize=".5em"
      >
        {percent}%
      </text>
      <text
        x="18"
        y="23"
        fill="var(--fg-default)"
        textAnchor="middle"
        fontSize=".225em"
      >
        {label}
      </text>
      <text
        x="18"
        y="27"
        fill="var(--fg-subtle)"
        textAnchor="middle"
        fontSize=".225em"
      >
        {subLabel}
      </text>
    </svg>
  );
}
