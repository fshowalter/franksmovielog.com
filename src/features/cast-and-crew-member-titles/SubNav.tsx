import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

/**
 * Alphabet navigation component for jumping to letter sections.
 * @param props - Component props
 * @param props.groupedValues - Map of grouped cast and crew values by letter
 * @param props.sortValue - Current sort configuration
 * @returns Alphabet navigation component or false if not sorting by name
 */
export function SubNav({
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
    <nav className={`sticky top-0 z-nav-menu bg-footer`}>
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container text-md font-semibold tracking-wide
          laptop:justify-center
        `}
      >
        {grades.map((letter) => {
          return (
            <NavLink
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
      </ul>
    </nav>
  );
}

function NavLink({
  linkFunc,
  value,
}: {
  linkFunc?: (value: string) => string;
  value: string;
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
          href={linkFunc(value)}
        >
          {value}
        </a>
      ) : (
        <div
          className={`
            p-4
            laptop:py-4
          `}
        >
          {value}
        </div>
      )}
    </li>
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
    <nav className={`sticky top-0 z-nav-menu bg-footer`}>
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container text-md font-semibold tracking-wide
          laptop:justify-center
        `}
      >
        {decades.map((decade) => {
          return (
            <NavLink
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
      </ul>
    </nav>
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
    <nav className={`sticky top-0 z-nav-menu bg-footer`}>
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container text-md font-semibold tracking-wide
          laptop:justify-center
        `}
      >
        {years.map((year) => {
          return (
            <NavLink
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
      </ul>
    </nav>
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
            <NavLink
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
      </ul>
    </nav>
  );
}
