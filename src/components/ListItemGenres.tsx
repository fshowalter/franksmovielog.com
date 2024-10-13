export function ListItemGenres({ values }: { values: readonly string[] }) {
  return (
    <div className="font-sans text-xs font-light leading-4 text-subtle">
      {values.map((value, index) => {
        if (index === 0) {
          return <span key={value}>{value}</span>;
        }

        return <span key={value}> | {value}</span>;
      })}
    </div>
  );
}
