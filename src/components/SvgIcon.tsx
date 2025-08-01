import React, { type JSX } from "react";

import { ccn } from "~/utils/concatClassNames";

export function SvgIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <svg
      className={ccn("fill-subtle", className)}
      height="1em"
      viewBox="0 0 16 16"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}
