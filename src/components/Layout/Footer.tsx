import { Logo } from "./Logo";
import type { NavItem } from "./navItems";
import { navItems } from "./navItems";

export function Footer(): JSX.Element {
  return (
    <footer
      className={
        "flex flex-wrap items-start justify-between gap-[10%] bg-footer px-container py-20 text-inverse tablet:px-12 tablet:pt-10 desktop:p-20"
      }
    >
      <div className="flex flex-col pb-12">
        <Logo />
      </div>
      <div className="flex flex-col gap-20 pb-20 pt-10 tablet:basis-1/2 tablet:pt-20">
        <ul className="flex w-full flex-col gap-y-10 text-inverse max:w-auto">
          {navItems.map((item) => {
            return <NavListItem key={item.target} value={item} />;
          })}
        </ul>
        <a
          href="#top"
          className="mb-8 w-full max-w-[320px] bg-canvas py-5 text-center font-sans-narrow text-sm uppercase tracking-[.6px] text-default hover:bg-inverse hover:text-inverse"
        >
          To the top
        </a>
        <p className="w-full font-normal leading-4 text-inverse-subtle">
          All stills used in accordance with the{" "}
          <a
            href="http://www.copyright.gov/title17/92chap1.html#107"
            className="text-inherit underline decoration-2 underline-offset-4 hover:bg-default hover:text-default"
          >
            Fair Use Law.
          </a>
        </p>
      </div>
    </footer>
  );
}

function NavListItem({ value }: { value: NavItem }): JSX.Element {
  return (
    <li className="block w-1/2 whitespace-nowrap text-2xl">
      <a className="hover:text-accent" href={value.target}>
        {value.text}
      </a>
      <SubNavList values={value.subItems} />
    </li>
  );
}

function SubNavList({ values }: { values: NavItem[] }): JSX.Element | null {
  if (values.length === 0) {
    return null;
  }

  return (
    <ol className="mt-4">
      {values.map((value) => {
        return (
          <li
            key={value.target}
            className="mb-2 font-sans-narrow text-sm uppercase tracking-[1px] text-inverse-subtle"
          >
            <a className="hover:text-inverse" href={value.target}>
              {value.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
