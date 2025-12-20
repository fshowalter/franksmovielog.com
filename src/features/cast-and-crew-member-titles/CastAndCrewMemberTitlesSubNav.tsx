import { SubNav, SubNavLink } from "~/components/sub-nav/SubNav";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

/**
 * Alphabet navigation component for jumping to letter sections.
 * @param props - Component props
 * @param props.groupedValues - Map of grouped cast and crew values by letter
 * @param props.sortValue - Current sort configuration
 * @returns Alphabet navigation component or false if not sorting by name
 */
export function CastAndCrewMemberTitlesSubNav({
  groupedValues,
  sortValue,
}: {
  groupedValues: Map<string, CastAndCrewMemberTitlesValue[]>;
  sortValue: CastAndCrewMemberTitlesSort;
}): React.JSX.Element {
  switch (sortValue) {
    case "grade-asc":
    case "grade-desc": {
      return (
        <GradeSubNav groupedValues={groupedValues} sortValue={sortValue} />
      );
    }
    case "release-date-asc":
    case "release-date-desc": {
      return (
        <ReleaseDateSubNav
          groupedValues={groupedValues}
          sortValue={sortValue}
        />
      );
    }
    case "review-date-asc":
    case "review-date-desc": {
      return (
        <ReviewDateSubNav groupedValues={groupedValues} sortValue={sortValue} />
      );
    }
    case "title-asc":
    case "title-desc": {
      return (
        <TitleSubNav groupedValues={groupedValues} sortValue={sortValue} />
      );
    }
  }
}

function GradeSubNav({
  groupedValues,
  sortValue,
}: {
  groupedValues: Map<string, CastAndCrewMemberTitlesValue[]>;
  sortValue: CastAndCrewMemberTitlesSort;
}): React.JSX.Element {
  const grades = [..."ABCDF"];

  if (groupedValues.has("Unreviewed")) {
    grades.push("Unreviewed");
  }

  if (sortValue == "grade-asc") {
    grades.reverse();
  }

  return (
    <SubNav>
      {grades.map((letter) => {
        return (
          <SubNavLink
            key={letter}
            linkFunc={
              groupedValues.has(`${letter}+`)
                ? (letter: string): string => `#${letter}+`
                : groupedValues.has(`${letter}`)
                  ? (letter: string): string => `#${letter}`
                  : groupedValues.has(`${letter}-`)
                    ? (letter: string): string => `#${letter}-`
                    : undefined
            }
            value={letter}
          />
        );
      })}
    </SubNav>
  );
}

function ReleaseDateSubNav({
  groupedValues,
  sortValue,
}: {
  groupedValues: Map<string, CastAndCrewMemberTitlesValue[]>;
  sortValue: CastAndCrewMemberTitlesSort;
}): React.JSX.Element {
  const decades = [...groupedValues.keys()].toSorted();

  if (sortValue == "release-date-desc") {
    decades.reverse();
  }

  return (
    <SubNav>
      {decades.map((decade) => {
        return (
          <SubNavLink
            key={decade}
            linkFunc={
              groupedValues.has(decade)
                ? (letter: string): string => `#${letter}`
                : undefined
            }
            value={decade}
          />
        );
      })}
    </SubNav>
  );
}

function ReviewDateSubNav({
  groupedValues,
  sortValue,
}: {
  groupedValues: Map<string, CastAndCrewMemberTitlesValue[]>;
  sortValue: CastAndCrewMemberTitlesSort;
}): React.JSX.Element {
  let reviewYears = [...groupedValues.keys()].toSorted();

  if (groupedValues.has("Unreviewed")) {
    reviewYears = reviewYears.slice(0, -1);
  }

  let currentYear = Number(reviewYears[0]);
  const latestYear = Number(reviewYears.at(-1));
  const years = [];

  while (currentYear <= latestYear) {
    years.push(currentYear);
    currentYear++;
  }

  if (sortValue == "review-date-desc") {
    years.reverse();
  }

  return (
    <SubNav>
      {years.map((year) => {
        return (
          <SubNavLink
            key={year}
            linkFunc={
              groupedValues.has(year.toString())
                ? (letter: string): string => `#${letter}`
                : undefined
            }
            value={year.toString()}
          />
        );
      })}
    </SubNav>
  );
}

function TitleSubNav({
  groupedValues,
  sortValue,
}: {
  groupedValues: Map<string, CastAndCrewMemberTitlesValue[]>;
  sortValue: CastAndCrewMemberTitlesSort;
}): React.JSX.Element {
  const letters = [..."#ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  if (sortValue == "title-desc") {
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
