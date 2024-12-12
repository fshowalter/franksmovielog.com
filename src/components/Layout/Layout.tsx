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
    <div>
      <a
        className="absolute left-1/2 top-0.5 z-50 mx-auto bg-subtle px-6 py-2 text-center text-accent [transform:translate(-50%,calc(-100%_-_2px))] focus:[transform:translate(-50%,0%)]"
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
        <main className={ccn("grow", className)} id="content" {...rest}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
