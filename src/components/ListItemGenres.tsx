export function ListItemGenres({
  values,
}: {
  values: readonly string[];
}): JSX.Element | null {
  return (
    <div className="font-sans text-sm leading-4 tracking-0.5px text-subtle">
      {values.map((value, index) => {
        if (index === 0) {
          return <span key={value}>{value}</span>;
        }

        return <span key={value}> | {value}</span>;
      })}
    </div>
  );
}
