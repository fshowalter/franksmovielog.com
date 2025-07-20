import type { JSX } from "react";

import { ccn } from "~/utils/concatClassNames";

export function StatsNavigation({
  className,
  currentYear,
  linkFunc,
  years,
}: {
  className?: string;
  currentYear: string;
  linkFunc: (year: string) => string;
  years: readonly string[];
}): JSX.Element {
  return (
    <nav className={ccn("bg-footer", className)}>
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-max) overflow-x-auto
          px-container font-sans text-sm font-normal tracking-wide
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
        text-center
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
            block transform-gpu p-4 whitespace-nowrap transition-all
            hover:scale-105 hover:bg-accent hover:text-inverse
            laptop:py-4
          `}
          href={linkFunc("all")}
        >
          All-Time
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
        text-center
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
            block transform-gpu p-4 transition-all
            hover:scale-105 hover:bg-accent hover:text-inverse
          `}
          href={linkFunc(year)}
        >
          {year}
        </a>
      )}
    </li>
  );
}
