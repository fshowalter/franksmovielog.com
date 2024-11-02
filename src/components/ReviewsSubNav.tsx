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
      <ul className="scrollbar-hidden mx-auto flex max-w-screen-max overflow-x-auto px-container font-sans text-xs font-medium uppercase tracking-wider tablet:justify-center">
        {Object.entries(items).map(([key, value]) => {
          return (
            <li
              className={`whitespace-nowrap text-center ${active === key ? "text-inverse" : "text-inverse-subtle"}`}
              key={value.href}
            >
              {active === key ? (
                <div className="bg-default p-6 text-default tablet:py-8">
                  {value.text}
                </div>
              ) : (
                <a
                  className="block p-6 hover:bg-accent hover:text-inverse tablet:py-8"
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
