type SubNavValue = {
  href: string;
  text: string;
};

const items: Record<string, SubNavValue> = {
  all: { href: "/reviews/", text: "All Reviews" },
  overrated: { href: "/reviews/overrated/", text: "Overrated" },
  underrated: { href: "/reviews/underrated/", text: "Underrated" },
  underseen: { href: "/reviews/underseen/", text: "Underseen" },
};

/**
 * Sub-navigation component for reviews section.
 * @param props - Component props
 * @param props.active - The currently active navigation item key
 * @returns Navigation component with review category links
 */
export function ReviewsSubNav({
  active,
}: {
  active: keyof typeof items;
}): React.JSX.Element {
  return (
    <nav className="bg-footer">
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container font-sans text-sm font-bold
          tracking-wider uppercase
          tablet:justify-center
        `}
      >
        {Object.entries(items).map(([key, value]) => {
          return (
            <li
              className={`
                snap-start text-center whitespace-nowrap
                ${active === key ? `text-white` : `text-grey`}
              `}
              key={value.href}
            >
              {active === key ? (
                <a
                  className={`block bg-default px-6 py-8 text-default`}
                  href={value.href}
                >
                  {value.text}
                </a>
              ) : (
                <a
                  className={`
                    group/item block transform-gpu px-6 pt-8 pb-7 transition-all
                    duration-500
                    hover:bg-accent hover:text-white
                  `}
                  href={value.href}
                >
                  <span
                    className={`
                      relative inline-block pb-1
                      after:absolute after:bottom-0 after:left-0 after:h-0.5
                      after:w-full after:origin-center after:scale-x-0
                      after:bg-white/80 after:transition-transform
                      after:duration-500
                      group-hover/item:after:scale-x-100
                    `}
                  >
                    {value.text}
                  </span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
