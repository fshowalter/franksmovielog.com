import type { MultiValue } from "react-select";

import Select from "react-select";

import { LabelText } from "~/components/LabelText";

export function MultiSelectField({
  label,
  onChange,
  options,
}: {
  label: string;
  onChange: (e: MultiValue<{ label: string; value: string }>) => void;
  options: readonly string[];
}) {
  return (
    <div className="flex flex-col text-left text-subtle">
      <LabelText as="label" htmlFor={label} value={label} />
      <Select
        classNamePrefix="reactSelect"
        inputId={label}
        isMulti={true}
        isSearchable={false}
        onChange={onChange}
        options={options.map((option) => {
          return { label: option, value: option };
        })}
        styles={{
          dropdownIndicator: (baseStyles) => ({
            ...baseStyles,
            color: "var(--border-color-accent)",
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 4,
          colors: {
            ...theme.colors,
            danger: "var(--fg-accent)",
            neutral0: "var(--bg-default)",
            neutral20: "var(--border-default)",
            neutral50: "var(--fg-defaults)",
            primary25: "var(--bg-stripe)",
          },
        })}
      />
    </div>
  );
}
