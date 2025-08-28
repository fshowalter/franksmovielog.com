import type { ChangeEvent, JSX } from "react";

import { LabelText } from "./LabelText";
import { SelectInput } from "./SelectInput";

export function SelectField({
  children,
  label,
  onChange,
  value,
}: {
  children: React.ReactNode;
  label: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}): JSX.Element {
  return (
    <label className="flex flex-col">
      <LabelText value={label} />
      <SelectInput onChange={onChange} value={value?.toString()}>
        {children}
      </SelectInput>
    </label>
  );
}
