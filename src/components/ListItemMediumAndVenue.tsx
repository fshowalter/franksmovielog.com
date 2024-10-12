export function ListItemMediumAndVenue({
  medium,
  venue,
}: {
  medium?: string | undefined;
  venue?: string | undefined;
}): false | JSX.Element {
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

  return false;
}
