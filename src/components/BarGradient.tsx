import React from "react";

export function BarGradient({
  value,
  maxValue,
}: {
  value: number;
  maxValue: number;
}): JSX.Element {
  const styles = {
    "--bar-percent": `${(value / maxValue) * 100}%`,
  } as React.CSSProperties;

  if (value === 0) {
    styles["lineHeight"] = 0;
    styles["margin"] = "0";
  }

  return (
    <div
      className="progress-bar-bg mb-2 leading-6 tablet:mb-0 tablet:mt-[2px] tablet:leading-9"
      style={styles}
    >
      &nbsp;
    </div>
  );
}
