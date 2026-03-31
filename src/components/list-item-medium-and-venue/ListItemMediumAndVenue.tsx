export function ListItemMediumAndVenue({
  medium,
  venue,
}: {
  medium?: string | undefined;
  venue?: string | undefined;
}): false | React.JSX.Element {
  const value = medium && venue ? `${medium} at ${venue}` : (medium ?? venue);

  if (!value) {
    throw new Error("Neither medium nor venue provided.");
  }

  return (
    <div className={`font-sans text-xs font-light tracking-prose text-subtle`}>
      {value}
    </div>
  );
}
