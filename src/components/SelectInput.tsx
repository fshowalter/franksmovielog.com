import type { ChangeEvent, JSX } from "react";

import React from "react";

export function SelectInput({
  children,
  onChange,
  value,
}: {
  children: React.ReactNode;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  value?: number | string | undefined;
}): JSX.Element {
  return (
    <select
      className={`
        w-full appearance-none border-none bg-default py-2 pr-8 pl-4 text-base
        leading-6 text-subtle shadow-all outline-accent
      `}
      onChange={onChange}
      value={value}
    >
      {children}
    </select>
  );
}
