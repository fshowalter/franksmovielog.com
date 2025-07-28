import type { ChangeEvent, JSX } from "react";

import React from "react";

import { ccn } from "~/utils/concatClassNames";

export function SelectInput({
  children,
  className,
  onChange,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  value?: number | string | undefined;
}): JSX.Element {
  return (
    <select
      className={ccn(
        `
          w-full appearance-none border-none bg-default py-1 pr-8 pl-2 text-base
          leading-6 text-subtle shadow-all outline-accent
        `,
        className,
      )}
      onChange={onChange}
      value={value}
    >
      {children}
    </select>
  );
}
