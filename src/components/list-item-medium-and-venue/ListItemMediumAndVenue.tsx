export function ListItemMediumAndVenue({
  medium,
  venue,
}: {
  medium?: string | undefined;
  venue?: string | undefined;
}): React.JSX.Element | undefined {
  const value = medium && venue ? `${medium} at ${venue}` : (medium ?? venue);

  if (!value) {
    // pre-2012 viewings don't have venue or medium
    return undefined;
  }

  return (
    <div className={`font-sans text-xs font-light tracking-prose text-subtle`}>
      {value}
    </div>
  );
}
