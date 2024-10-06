import { ccn } from "src/utils/concatClassNames";

function AllTimeLink({
  currentYear,
  linkFunc,
}: {
  currentYear: string;
  linkFunc: (year: string) => string;
}): JSX.Element {
  return (
    <li
      className={`text-center ${"all" === currentYear ? "text-inverse" : "text-inverse-subtle"}`}
    >
      {"all" === currentYear ? (
        <div className="whitespace-nowrap desktop:py-4">All-Time</div>
      ) : (
        <a
          className="block whitespace-nowrap hover:bg-default hover:text-default desktop:py-4"
          href={linkFunc("all")}
        >
          All-Time
        </a>
      )}
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
  return (
    <li
      className={`text-center ${year === currentYear ? "text-inverse" : "text-inverse-subtle"}`}
    >
      {year === currentYear ? (
        <div className="">{year}</div>
      ) : (
        <a
          className="block hover:bg-default hover:text-default desktop:py-4"
          href={linkFunc(year)}
        >
          {year}
        </a>
      )}
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
    <nav className={ccn("bg-footer", className)}>
      <ul className="mx-auto flex max-w-screen-max flex-wrap justify-center gap-x-4 gap-y-2 px-container py-4 font-sans text-sm">
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
    </nav>
  );
}
