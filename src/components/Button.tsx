import type { JSX } from "react";

import { ccn } from "~/utils/concatClassNames";

export function Button({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      className={ccn(
        `
          mx-auto w-full max-w-button transform-gpu cursor-pointer rounded-md
          bg-canvas py-5 text-center font-sans text-sm font-bold tracking-wide
          uppercase shadow-all transition-transform
          hover:scale-105 hover:drop-shadow-lg
        `,
        className,
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
