export function ListItemMediumAndVenue({
  medium,
  venue,
}: {
  medium?: string | null;
  venue?: string | null;
}): JSX.Element | null {
  if (medium && venue) {
    return (
      <>
        <div className="font-sans text-xs font-light text-subtle">
          {medium} at {venue}
        </div>
      </>
    );
  }

  if (medium) {
    return (
      <>
        <div className="font-sans text-xs font-light text-subtle">{medium}</div>
      </>
    );
  }

  if (venue) {
    return (
      <>
        <div className="font-sans text-xs font-light text-subtle">{venue}</div>
      </>
    );
  }

  return null;
}
