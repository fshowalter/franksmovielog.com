import type { JSX } from "react";

import type { NavItem } from "./navItems";

import { Logo } from "./Logo";
import { navItems } from "./navItems";

export function Footer(): JSX.Element {
  return (
    <footer className={"bg-footer text-inverse"}>
      <div className="mx-auto max-w-(--breakpoint-desktop) px-container py-20">
        <div
          className={`
            flex w-full flex-col
            tablet:flex-row-reverse tablet:justify-between
          `}
        >
          <a
            className={`
              mx-auto mb-8 w-full max-w-button bg-canvas py-5 text-center
              font-sans text-xs tracking-wide text-default uppercase
              hover:bg-inverse hover:text-inverse
              tablet:mx-0
            `}
            href="#top"
          >
            To the top
          </a>
          <Logo />
        </div>
        <div
          className={`
            justify-between
            tablet:flex
          `}
        >
          <div
            className={`
              flex max-w-prose flex-col pb-12
              tablet:pr-32
            `}
          >
            <div
              className={`
                footer-text pt-10 font-sans text-base font-light
                text-inverse-subtle
              `}
            >
              <p>
                Hi there, I&apos;m Frank, a husband and father old enough to
                have sat wide-eyed during <em>E.T</em>&apos;s first theatrical
                run, I&apos;ve been watching, absorbing, and dissecting films
                ever since.
              </p>

              <p>
                This site began in 2003 when I realized two things: I had become
                the designated &ldquo;movie guy&rdquo; among my friends (you
                know, the one everyone asks about every new release), and I was
                frequently experiencing the peculiar déjà vu of realizing,
                halfway through a film, that I&apos;d already seen it. Clearly,
                I needed a system.
              </p>

              <p>
                What began as personal record-keeping evolved into this little
                corner of the internet where I share my thoughts on everything
                from blockbusters to obscure indies that deserved better.
              </p>

              <p>
                New visitors might want to start by reading about{" "}
                <a href="/how-i-grade/">how I grade</a> films. After that, feel
                free to browse my <a href="/reviews/">reviews</a>. If
                you&apos;re looking for something that flew under the radar but
                deserves your attention, I recommend my{" "}
                <a href="/reviews/underseen/">underseen gems</a> section. Or,
                for those moments when you want to feel righteously contrarian,
                I maintain an list of{" "}
                <a href="/reviews/overrated/">overrated disappointments</a>.
              </p>

              <p>
                I also keep a <a href="/viewings/">viewing log</a> that tracks
                everything I watch, whether it gets a full review or not,
                complete with <a href="/viewings/stats/">stats</a>. In an age of
                endless content, sometimes the act of remembering what
                we&apos;ve seen becomes as important as the seeing itself.
              </p>

              <p>
                And finally, if you&apos;re curious about what&apos;s on my
                critical horizon, my <a href="/watchlist/">watchlist</a> details
                the films I plan to review and why they&apos;ve caught my
                interest.
              </p>

              <p>
                In an era of algorithmic recommendations and corporate marketing
                machines, consider this site a human alternative—one
                person&apos;s attempt to catalog the vast ocean of cinema and
                maybe help a few fellow travelers along the way.
              </p>
            </div>
          </div>
          <div
            className={`
              flex grow-0 flex-col gap-20 pt-10 pb-20
              tablet:basis-button tablet:pr-10
            `}
          >
            <ul
              className={`
                flex w-full flex-col gap-y-10 text-inverse
                max:w-auto
              `}
            >
              {navItems.map((item) => {
                return <NavListItem key={item.target} value={item} />;
              })}
            </ul>
          </div>
        </div>
      </div>
      <p
        className={`
          w-full bg-canvas px-container py-10 text-center leading-5 font-normal
          text-default
        `}
      >
        All reviews by Frank Showalter. All images used in accordance with the{" "}
        <a
          className={`
            text-inherit underline decoration-dashed underline-offset-4
            hover:bg-default hover:text-default
          `}
          href="http://www.copyright.gov/title17/92chap1.html#107"
          rel="nofollow"
        >
          Fair Use Law
        </a>
        .
      </p>
    </footer>
  );
}

function NavListItem({ value }: { value: NavItem }): JSX.Element {
  return (
    <li className="block w-1/2 text-2xl whitespace-nowrap">
      <a className="hover:text-accent" href={value.target}>
        {value.text}
      </a>
      <SubNavList values={value.subItems} />
    </li>
  );
}

function SubNavList({ values }: { values: NavItem[] }): false | JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <ol className="mt-4">
      {values.map((value) => {
        return (
          <li
            className={`
              mb-4 ml-1 font-sans text-xs tracking-wide text-inverse-subtle
              uppercase
              last:mb-0
            `}
            key={value.target}
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
