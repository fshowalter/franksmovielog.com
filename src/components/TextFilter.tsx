import type { JSX } from "react";

import { debounceOnChange } from "~/utils/debounce";

import { LabelText } from "./LabelText";

type onChangeHandler = (value: string) => void;

export function TextFilter({
  label,
  onInputChange,
  placeholder,
}: {
  label: string;
  onInputChange: onChangeHandler;
  placeholder: string;
}): JSX.Element {
  const debouncedHandleChange = debounceOnChange(onInputChange, 150);

  return (
    <label className="flex flex-col text-subtle">
      <LabelText value={label} />
      <input
        className={`
          border-0 bg-default px-4 py-2 text-base text-default shadow-all
          outline-accent
          placeholder:text-default placeholder:opacity-50
        `}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          debouncedHandleChange((e.target as HTMLInputElement).value)
        }
        placeholder={placeholder}
        type="text"
      />
    </label>
  );
}
