import type { JSX } from "react";

import { ccn } from "~/utils/concatClassNames";

import { Footer } from "./Footer";
import { Mast } from "./Mast";

export function Layout({
  addGradient,
  children,
  className,
  hasBackdrop = true,
  hideLogo = false,
  ...rest
}: {
  [x: string]: unknown;
  addGradient?: boolean;
  children: React.ReactNode;
  className?: string;
  hasBackdrop?: boolean;
  hideLogo?: boolean;
}): JSX.Element {
  if (addGradient === undefined) {
    addGradient = hasBackdrop;
  }

  return (
    <div className="group">
      <a
        className={`
          absolute top-0.5 left-1/2 z-50 mx-auto
          [transform:translate(-50%,calc(-100%-2px))]
          bg-subtle px-6 py-2 text-center text-accent
          focus:[transform:translate(-50%,0%)]
        `}
        href="#content"
      >
        Skip to content
      </a>
      <div className="flex min-h-full w-full flex-col bg-default">
        <Mast
          addGradient={addGradient}
          hasBackdrop={hasBackdrop}
          hideLogo={hideLogo}
        />
        <main
          className={ccn(
            `
              grow
              min-[381px]:group-has-[[data-drawer]:checked]:before:absolute
              min-[381px]:group-has-[[data-drawer]:checked]:before:top-0
              min-[381px]:group-has-[[data-drawer]:checked]:before:left-0
              min-[381px]:group-has-[[data-drawer]:checked]:before:z-10
              min-[381px]:group-has-[[data-drawer]:checked]:before:size-full
              min-[381px]:group-has-[[data-drawer]:checked]:before:bg-[rgba(255,255,255,.2)]
              tablet-landscape:group-has-[[data-drawer]:checked]:before:hidden
            `,
            className,
          )}
          id="content"
          {...rest}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
