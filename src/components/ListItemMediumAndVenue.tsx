import type { JSX } from "react";
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
        <div
          className={`
            font-sans text-xs font-light text-subtle
            tablet:text-xxs
          `}
        >
          {medium} at {venue}
        </div>
      </>
    );
  }

  if (medium) {
    return (
      <>
        <div
          className={`
            font-sans text-xs font-light text-subtle
            tablet:text-xxs
          `}
        >
          {medium}
        </div>
      </>
    );
  }

  if (venue) {
    return (
      <>
        <div
          className={`
            font-sans text-xs font-light text-subtle
            tablet:text-xxs
          `}
        >
          {venue}
        </div>
      </>
    );
  }

  return false;
}
