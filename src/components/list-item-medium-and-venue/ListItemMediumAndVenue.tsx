export function ListItemMediumAndVenue({
  medium,
  venue,
}: {
  medium?: string | undefined;
  venue?: string | undefined;
}): React.JSX.Element | undefined {
  const value = medium && venue ? `${medium} at ${venue}` : (medium ?? venue);

  return value ? (
    <div className={`font-sans text-xs font-light tracking-prose text-subtle`}>
      {value}
    </div>
  ) : undefined; // pre-2012 viewings don't have venue or medium
}
