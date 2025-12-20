import { SubNav, SubNavLink } from "~/components/sub-nav/SubNav";

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
    <SubNav>
      {letters.map((letter) => {
        return (
          <SubNavLink
            key={letter}
            linkFunc={
              groupedValues.has(letter)
                ? (letter: string): string => `#${letter}`
                : undefined
            }
            value={letter}
          />
        );
      })}
    </SubNav>
  );
}
