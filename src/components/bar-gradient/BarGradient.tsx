/**
 * Renders a gradient bar representing a value relative to a maximum.
 * @param props - Component props
 * @param props.maxValue - The maximum value for the bar
 * @param props.value - The current value to display
 * @returns Gradient bar element with width based on value/maxValue ratio
 */
export function BarGradient({
  maxValue,
  value,
}: {
  maxValue: number;
  value: number;
}): React.JSX.Element {
  const styles = {
    "--bar-percent": `${(value / maxValue) * 100}%`,
  } as React.CSSProperties;

  return (
    <div
      className={`
        bg-progress-bar leading-[6px]
        tablet:mb-0
      `}
      style={styles}
    >
      &nbsp;
    </div>
  );
}
