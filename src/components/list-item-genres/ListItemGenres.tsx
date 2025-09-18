/**
 * Displays a comma-separated list of genres.
 * @param props - Component props
 * @param props.values - Array of genre names to display
 * @returns Formatted genre list with proper comma separation
 */
export function ListItemGenres({
  values,
}: {
  values: readonly string[];
}): React.JSX.Element {
  return (
    <div className={`font-sans text-xs leading-4 tracking-prose text-subtle`}>
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
