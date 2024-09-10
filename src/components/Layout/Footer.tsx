import { NavListItems } from "./NavListItems";

export function Footer({ currentPath }: { currentPath: string }): JSX.Element {
  return (
    <footer
      className={
        "flex flex-col items-start justify-between bg-[#252525] px-8 pb-20 pt-8 text-inverse tablet:px-12 tablet:pt-10 desktop:flex-row desktop:p-20"
      }
    >
      <div className="items-inherit flex flex-col">
        <h1
          className="whitespace-nowrap font-normal leading-8 text-[#fff]"
          style={{ fontSize: "1.5625rem" }}
        >
          <a href="/">Frank&apos;s Movie Log</a>
        </h1>
        <p
          className={
            "w-full text-sm italic leading-4 text-subtle desktop:pl-px"
          }
        >
          My life at the movies.
        </p>
        <div className="spacer-y-12" />
      </div>
      <div className="tablet:pl-[32%] desktop:w-[51.9607843137%] desktop:pl-0">
        <ul className="flex w-full flex-col gap-y-10 text-inverse max:w-auto">
          <li className="block w-1/2 whitespace-nowrap text-2xl">
            <a href="/">Home</a>
          </li>
          <li className="block w-1/2 whitespace-nowrap text-2xl">
            <a href="/how-i-grade/">How I Grade</a>
          </li>
          <li className="block w-1/2 whitespace-nowrap text-2xl">
            <a href="/reviews/">Reviews</a>
            <ol className="mt-4">
              <li className="mb-2 font-sans-caps text-sm uppercase tracking-[1px] text-subtle">
                <a href="/reviews/underseen/">Underseen Gems</a>
              </li>
              <li className="mb-2 font-sans-caps text-sm uppercase tracking-[1px] text-subtle">
                <a href="/reviews/overrated/">Overrated Disappointments</a>
              </li>
            </ol>
          </li>
          <li className="block w-1/2 whitespace-nowrap text-2xl">
            <a href="/viewings/">Viewing Log</a>
            <ol className="mt-4">
              <li className="mb-2 font-sans-caps text-sm uppercase tracking-[1px] text-subtle">
                <a href="/viewings/stats/">Stats</a>
              </li>
            </ol>
          </li>
          <li className="block w-1/2 whitespace-nowrap text-2xl">
            <a href="/cast-and-crew/">Cast & Crew</a>
          </li>
          <li className="block w-1/2 whitespace-nowrap text-2xl">
            <a href="/collections/">Collections</a>
          </li>
          <li className="block w-1/2 whitespace-nowrap text-2xl">
            <a href="/watchlist/">Watchlist</a>
            <ol className="mt-4">
              <li className="mb-2 font-sans-caps text-sm uppercase tracking-[1px] text-subtle">
                <a href="/watchlist/progress/">Progress</a>
              </li>
            </ol>
          </li>
        </ul>
        <div className="spacer-y-20" />
        <p className="font-light leading-4 text-subtle">
          All stills used in accordance with the{" "}
          <a
            href="http://www.copyright.gov/title17/92chap1.html#107"
            className="text-inherit"
          >
            Fair Use Law.
          </a>
        </p>
        <a href="#top" className="sr-only">
          To the top ↑
        </a>
      </div>
    </footer>
  );
}
