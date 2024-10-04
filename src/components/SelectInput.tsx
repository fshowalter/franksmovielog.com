import type { ChangeEvent } from "react";
import React from "react";
import { ccn } from "src/utils/concatClassNames";

export function SelectInput({
  value,
  onChange,
  children,
  className,
}: {
  value?: string | number | undefined;
  children: React.ReactNode;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}): JSX.Element {
  return (
    <select
      value={value}
      onChange={onChange}
      className={ccn(
        "w-full appearance-none border-none bg-default py-2 pl-4 pr-8 text-base leading-6 text-subtle shadow-all outline-accent",
        className,
      )}
    >
      {children}
    </select>
  );
}
