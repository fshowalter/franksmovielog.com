export function SubNav({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <nav className={`sticky top-0 z-nav-menu bg-footer`}>
      <div
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container text-md font-semibold tracking-wide
          laptop:justify-center
        `}
      >
        <h3
          className={`
            snap-start p-4 font-sans tracking-normal whitespace-nowrap text-grey
          `}
        >
          Jump to:
        </h3>
        <ul className={`contents`}>{children}</ul>
      </div>
    </nav>
  );
}

export function SubNavLink({
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
