import type { JSX } from "react";

export function StatsNavigation({
  bgClasses = "bg-footer",
  currentYear,
  linkFunc,
  marginClasses,
  widthClasses,
  years,
}: {
  bgClasses?: string;
  currentYear: string;
  linkFunc: (year: string) => string;
  marginClasses?: string;
  widthClasses?: string;
  years: readonly string[];
}): JSX.Element {
  return (
    <nav
      className={`
        ${bgClasses}
        ${marginClasses ?? ""}
        ${widthClasses ?? ""}
      `}
    >
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container font-sans text-base font-semibold
          tracking-wide
          laptop:justify-center
        `}
      >
        <AllTimeLink currentYear={currentYear} linkFunc={linkFunc} />
        {[...years].reverse().map((year) => {
          return (
            <YearLink
              currentYear={currentYear}
              key={year}
              linkFunc={linkFunc}
              year={year}
            />
          );
        })}
      </ul>
    </nav>
  );
}

function AllTimeLink({
  currentYear,
  linkFunc,
}: {
  currentYear: string;
  linkFunc: (year: string) => string;
}): JSX.Element {
  return (
    <li
      className={`
        snap-start text-center
        ${"all" === currentYear ? "text-inverse" : `text-inverse-subtle`}
      `}
    >
      {"all" === currentYear ? (
        <div
          className={`
            bg-subtle p-4 whitespace-nowrap text-default
            laptop:py-4
          `}
        >
          All-Time
        </div>
      ) : (
        <a
          className={`
            group/all-time block transform-gpu px-4 pt-4 pb-3 whitespace-nowrap
            transition-all duration-500
            hover:bg-accent hover:text-inverse
          `}
          href={linkFunc("all")}
        >
          <span
            className={`
              relative inline-block pb-1
              after:absolute after:bottom-0 after:left-0 after:h-0.5
              after:w-full after:origin-center after:scale-x-0
              after:bg-(--fg-inverse) after:transition-transform
              after:duration-500
              group-hover/all-time:after:scale-x-100
            `}
          >
            All-Time
          </span>
        </a>
      )}
    </li>
  );
}

function YearLink({
  currentYear,
  linkFunc,
  year,
}: {
  currentYear: string;
  linkFunc: (y: string) => string;
  year: string;
}) {
  return (
    <li
      className={`
        snap-start text-center
        ${year === currentYear ? "text-inverse" : `text-inverse-subtle`}
      `}
    >
      {year === currentYear ? (
        <div
          className={`
            bg-subtle p-4 text-default
            laptop:py-4
          `}
        >
          {year}
        </div>
      ) : (
        <a
          className={`
            group/year block transform-gpu px-4 pt-4 pb-3 transition-all
            duration-500
            hover:bg-accent hover:text-inverse
          `}
          href={linkFunc(year)}
        >
          <span
            className={`
              relative inline-block pb-1
              after:absolute after:bottom-0 after:left-0 after:h-0.5
              after:w-full after:origin-center after:scale-x-0
              after:bg-(--fg-inverse) after:transition-transform
              after:duration-500
              group-hover/year:after:scale-x-100
            `}
          >
            {year}
          </span>
        </a>
      )}
    </li>
  );
}
