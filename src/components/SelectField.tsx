import type { ChangeEvent } from "react";
import { ccn } from "src/utils/concatClassNames";

import { LabelText } from "./LabelText";
import { SelectInput } from "./SelectInput";

export function SelectField({
  label,
  value,
  onChange,
  children,
  className,
}: {
  label: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <label className={ccn("flex flex-col", className)}>
      <LabelText value={label} />
      <SelectInput value={value?.toString()} onChange={onChange}>
        {children}
      </SelectInput>
    </label>
  );
}
