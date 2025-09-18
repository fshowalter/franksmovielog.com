/**
 * Displays viewing medium and/or venue information.
 * @param props - Component props
 * @param props.medium - The viewing medium (e.g., "4k UHD Blu-ray", "35mm")
 * @param props.venue - The viewing venue (e.g., "Alamo Drafthouse")
 * @returns Formatted medium and venue text, or false if neither provided
 */
export function ListItemMediumAndVenue({
  medium,
  venue,
}: {
  medium?: string | undefined;
  venue?: string | undefined;
}): false | React.JSX.Element {
  if (medium && venue) {
    return (
      <div
        className={`font-sans text-xs font-light tracking-prose text-subtle`}
      >
        {medium} at {venue}
      </div>
    );
  }

  if (medium) {
    return (
      <div
        className={`font-sans text-xs font-light tracking-prose text-subtle`}
      >
        {medium}
      </div>
    );
  }

  if (venue) {
    return (
      <div
        className={`font-sans text-xs font-light tracking-prose text-subtle`}
      >
        {venue}
      </div>
    );
  }

  return false;
}
