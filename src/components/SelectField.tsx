import type { JSX } from "react";

import { ccn } from "~/utils/concatClassNames";

import { LabelText } from "./LabelText";
import { SelectInput } from "./SelectInput";

export function SelectField({
  children,
  className,
  initialValue,
  label,
  onChange,
}: {
  children: React.ReactNode;
  className?: string;
  initialValue: string | undefined;
  label: string;
  onChange: (value: string) => void;
}): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <label className={ccn("flex flex-col", className)}>
      <LabelText value={label} />
      <SelectInput onChange={handleChange} value={initialValue}>
        {children}
      </SelectInput>
    </label>
  );
}
