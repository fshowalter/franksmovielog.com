import type { JSX } from "react";
export function StatsCallout({
  label,
  value,
}: {
  label: string;
  value: number;
}): JSX.Element {
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
          font-sans text-xxs leading-6 font-light text-subtle
          tablet:text-sm
        `}
      >
        {label}
      </div>
    </div>
  );
}
