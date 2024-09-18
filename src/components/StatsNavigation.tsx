import { ccn } from "src/utils/concatClassNames";

function AllTimeLink({
  currentYear,
  linkFunc,
}: {
  currentYear: string;
  linkFunc: (year: string) => string;
}): JSX.Element {
  if (!currentYear || currentYear === "all") {
    return <></>;
  }

  return (
    <li className="block">
      <a href={linkFunc("all")}>All-Time</a>
    </li>
  );
}

function YearLink({
  year,
  currentYear,
  linkFunc,
}: {
  year: string;
  currentYear: string;
  linkFunc: (y: string) => string;
}): JSX.Element | null {
  if (year === currentYear) {
    return <li className="block">{year}</li>;
  }

  return (
    <li className="block">
      <a href={linkFunc(year)}>{year}</a>
    </li>
  );
}

export function StatsNavigation({
  currentYear,
  years,
  linkFunc,
  className,
}: {
  currentYear: string;
  years: readonly string[];
  linkFunc: (year: string) => string;
  className?: string;
}): JSX.Element {
  return (
    <ul
      className={ccn(
        "flex flex-wrap justify-center gap-x-4 gap-y-2 text-md underline decoration-1 underline-offset-8 desktop:text-xl",
        className,
      )}
    >
      <AllTimeLink currentYear={currentYear} linkFunc={linkFunc} />
      {[...years].reverse().map((year) => {
        return (
          <YearLink
            key={year}
            year={year}
            currentYear={currentYear}
            linkFunc={linkFunc}
          />
        );
      })}
    </ul>
  );
}
