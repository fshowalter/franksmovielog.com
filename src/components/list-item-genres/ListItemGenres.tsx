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
    <div className={`font-sans text-xs/4 tracking-prose text-subtle`}>
      {values.map((value, index) => {
        return index === 0 ? (
          <span key={value}>{value}</span>
        ) : (
          <span key={value}>
            , <span className="whitespace-nowrap">{value}</span>
          </span>
        );
      })}
    </div>
  );
}
