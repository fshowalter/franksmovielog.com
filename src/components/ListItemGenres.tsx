export function ListItemGenres({ values }: { values: readonly string[] }) {
  return (
    <div
      className={`
        font-sans text-xs leading-4 font-light text-subtle
        tablet-landscape:text-xxs
      `}
    >
      {values.map((value, index) => {
        if (index === 0) {
          return <span key={value}>{value}</span>;
        }

        return (
          <>
            <span
              className={`
                hidden
                tablet-landscape:inline
              `}
              key={value}
            >
              , <span className="whitespace-nowrap">{value}</span>
            </span>
            <span className={`tablet-landscape:hidden`} key={value}>
              {" "}
              | <span className="whitespace-nowrap">{value}</span>
            </span>
          </>
        );
      })}
    </div>
  );
}
