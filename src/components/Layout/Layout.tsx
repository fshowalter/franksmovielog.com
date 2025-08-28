import type { JSX } from "react";

import { Footer } from "./Footer";
import { Mast } from "./Mast";

export function Layout({
  bgClasses = "bg-subtle",
  children,
  flexClasses,
  growClasses = "grow",
  hasBackdrop = true,
  hideLogo = false,
  itemsClasses,
  paddingClasses,
  ...mainProps
}: {
  [key: string]: unknown;
  bgClasses?: string;
  children: React.ReactNode;
  flexClasses?: string;
  growClasses?: string;
  hasBackdrop?: boolean;
  hideLogo?: boolean;
  itemsClasses?: string;
  paddingClasses?: string;
}): JSX.Element {
  return (
    <div className="group">
      <a
        className={`
          absolute top-0.5 left-1/2 z-skip-link mx-auto
          [transform:translate(-50%,calc(-100%-2px))]
          bg-subtle px-6 py-2 text-center text-accent
          focus:[transform:translate(-50%,0%)]
        `}
        href="#content"
      >
        Skip to content
      </a>
      <div className="flex min-h-full w-full flex-col bg-default">
        <Mast hasBackdrop={hasBackdrop} hideLogo={hideLogo} />
        <main
          className={`
            ${growClasses}
            ${bgClasses}
            ${flexClasses ?? ""}
            ${paddingClasses ?? ""}
            ${itemsClasses ?? ""}
          `}
          id="content"
          {...mainProps}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
