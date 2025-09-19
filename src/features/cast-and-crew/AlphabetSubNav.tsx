import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewSort } from "./sortCastAndCrew";

/**
 * Alphabet navigation component for jumping to letter sections.
 * @param props - Component props
 * @param props.groupedValues - Map of grouped cast and crew values by letter
 * @param props.sortValue - Current sort configuration
 * @returns Alphabet navigation component or false if not sorting by name
 */
export function AlphabetSubNav({
  groupedValues,
  sortValue,
}: {
  groupedValues: Map<string, CastAndCrewValue[]>;
  sortValue: CastAndCrewSort;
}): false | React.JSX.Element {
  if (!sortValue.startsWith("name-")) {
    return false;
  }

  const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  if (sortValue == "name-desc") {
    letters.reverse();
  }

  return (
    <nav className={`sticky top-0 z-nav-menu bg-footer`}>
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container text-md font-semibold tracking-wide
          laptop:justify-center
        `}
      >
        {letters.map((letter) => {
          return (
            <LetterLink
              key={letter}
              letter={letter}
              linkFunc={
                groupedValues.has(letter)
                  ? (letter: string): string => `#${letter}`
                  : undefined
              }
            />
          );
        })}
      </ul>
    </nav>
  );
}

function LetterLink({
  letter,
  linkFunc,
}: {
  letter: string;
  linkFunc?: (letter: string) => string;
}): React.JSX.Element {
  return (
    <li
      className={`
        snap-start text-center font-sans
        ${linkFunc ? "text-white" : `text-grey`}
      `}
    >
      {linkFunc ? (
        <a
          className={`
            block transform-gpu p-4 transition-all
            hover:scale-105 hover:bg-canvas hover:text-default
          `}
          href={linkFunc(letter)}
        >
          {letter}
        </a>
      ) : (
        <div
          className={`
            p-4
            laptop:py-4
          `}
        >
          {letter}
        </div>
      )}
    </li>
  );
}
