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

export function ReviewsSubNav({ active }: { active: keyof typeof items }) {
  return (
    <nav className="bg-footer">
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container font-sans text-xs font-medium
          tracking-wider uppercase
          tablet:justify-center
        `}
      >
        {Object.entries(items).map(([key, value]) => {
          return (
            <li
              className={`
                snap-start text-center whitespace-nowrap
                ${active === key ? `text-inverse` : `text-inverse-subtle`}
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
                    block transform-gpu px-6 py-8 transition-all
                    hover:scale-105 hover:bg-accent hover:text-inverse
                  `}
                  href={value.href}
                >
                  {value.text}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
