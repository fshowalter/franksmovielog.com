export function StatsCallout({
  value,
  label,
}: {
  value: number;
  label: string;
}): JSX.Element {
  return (
    <div className="flex size-36 flex-col justify-center rounded-[50%] bg-canvas text-center text-default shadow-all">
      <div className="text-[2rem] leading-8">{value.toLocaleString()}</div>{" "}
      <div className="font-sans-book text-sm leading-6 text-subtle">
        {label}
      </div>
    </div>
  );
}
