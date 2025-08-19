export function ListItemGenres({ values }: { values: readonly string[] }) {
  return (
    <div
      className={`
        font-sans text-xs leading-4 font-light tracking-prose text-subtle
      `}
    >
      {values.map((value, index) => {
        if (index === 0) {
          return <span key={value}>{value}</span>;
        }

        return (
          <span key={value}>
            , <span className="whitespace-nowrap">{value}</span>
          </span>
        );
      })}
    </div>
  );
}
