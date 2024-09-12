export function ListItemGenres({
  values,
}: {
  values: readonly string[];
}): JSX.Element | null {
  return (
    <div className="mt-auto font-sans-book text-xs leading-4 tracking-[-.3px] text-subtle">
      {values.map((value, index) => {
        if (index === 0) {
          return <span key={value}>{value}</span>;
        }

        return <span key={value}> | {value}</span>;
      })}
    </div>
  );
}
