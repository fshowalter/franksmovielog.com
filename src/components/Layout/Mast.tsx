import { NavListItems } from "./NavListItems";

export function Mast({
  currentPath,
  hideLogo,
  hasBackdrop,
}: {
  hideLogo: boolean;
  hasBackdrop: boolean;
  currentPath: string;
}) {
  return (
    <header
      className="flex w-full items-center justify-end px-[8%] py-4 text-center tablet:px-8 tablet:py-6 desktop:inset-x-0 desktop:z-40 desktop:flex-row desktop:flex-wrap desktop:px-16 desktop:py-8 desktop:text-left"
      style={{
        color: hasBackdrop ? "#fff" : "var(--fg-default)",
        position: hasBackdrop ? "absolute" : "static",
        backgroundImage: hasBackdrop
          ? "linear-gradient(to bottom, rgba(0,0,0,.85), transparent)"
          : "unset",
      }}
    >
      {!hideLogo && (
        <div className="items-inherit justify-items-inherit flex flex-col desktop:absolute desktop:left-[var(--page-margin-width)]">
          <h1
            className="whitespace-nowrap font-normal leading-8"
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
        </div>
      )}
      <nav className="hidden w-full desktop:block desktop:w-auto">
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xl tablet:gap-x-6 desktop:justify-start">
          <NavListItems
            activeClassName="text-[#e0e0e0]"
            currentPath={currentPath}
          />
        </ul>
      </nav>
      <div className="z-[1000]">
        <button
          data-open-modal
          disabled
          aria-label="Search"
          aria-keyshortcuts="Control+K"
          className="flex w-full items-center overflow-hidden text-sm leading-6 ring-default hover:ring-accent desktop:ml-6 desktop:w-auto desktop:rounded-lg desktop:bg-inverse desktop:px-2 desktop:py-1 desktop:text-[#000] desktop:opacity-85 desktop:shadow-all desktop:ring-1 desktop:hover:opacity-100"
        >
          <kbd className="ml-auto mt-px hidden min-h-6 flex-none items-center pl-3 pr-4 font-mono text-sm font-light opacity-70 desktop:flex">
            <kbd className="text-md leading-5">Ctrl</kbd>
            <kbd className="text-sm">K</kbd>
          </kbd>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
      <input type="checkbox" id="mobile-nav" className="hidden" />
      <label htmlFor="mobile-nav" className="hamburger-icon desktop:hidden">
        <span
          style={{ background: hasBackdrop ? "#fff" : "var(--fg-default)" }}
          className="hamburger-icon-bars"
        />
      </label>
      <ul className="hamburger-menu flex flex-col items-start gap-y-5 text-left text-[#fff] desktop:hidden max:w-auto">
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
    </header>
  );
}
