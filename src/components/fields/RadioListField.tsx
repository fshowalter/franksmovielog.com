import type { KeyboardEvent } from "react";

import { useEffect, useState } from "react";

import { LabelText } from "./LabelText";

export type RadioListFieldOption = {
  count: number;
  label: string;
  value: string;
};

export type RadioListFieldProps = {
  defaultValue?: string;
  label: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  options: readonly RadioListFieldOption[];
};

/**
 * Radio list field for single-selection with clear functionality.
 * @param props - Component props
 * @param props.defaultValue - Default selected value
 * @param props.label - Field label text (visually hidden but accessible)
 * @param props.onChange - Handler for selection changes
 * @param props.onClear - Handler for clear action
 * @param props.options - Available options with labels, values, and counts
 * @returns Radio list field with clear functionality
 */
export function RadioListField({
  defaultValue,
  label,
  onChange,
  onClear,
  options,
}: RadioListFieldProps): React.JSX.Element {
  const [selectedValue, setSelectedValue] = useState<string>(
    defaultValue ?? "",
  );

  const handleRadioChange = (value: string): void => {
    setSelectedValue(value);
    onChange(value);
  };

  const handleClear = (): void => {
    const resetValue = defaultValue ?? "";
    setSelectedValue(resetValue);
    onChange(resetValue);
    if (onClear) {
      onClear();
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: string,
  ): void => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleRadioChange(value);
    }
  };

  // AIDEV-NOTE: Sync internal state when defaultValue prop changes (e.g., when filters are cleared)
  // This is a controlled component pattern where external state changes need to update internal state
  useEffect(() => {
    setSelectedValue(defaultValue ?? ""); // eslint-disable-line react-hooks/set-state-in-effect
  }, [defaultValue]);

  // AIDEV-NOTE: Listen for form reset events and reset to default value when form is reset
  useEffect(() => {
    // Find the parent form element
    const form = document.querySelector("form");
    if (!form) return;

    const handleFormReset = (): void => {
      setSelectedValue(defaultValue ?? "");
    };

    form.addEventListener("reset", handleFormReset);

    return (): void => {
      form.removeEventListener("reset", handleFormReset);
    };
  }, [defaultValue]);

  const fieldsetId = `radio-list-${label.toLowerCase().replaceAll(/\s+/g, "-")}`;
  const hasNonDefaultSelection =
    selectedValue !== "" && selectedValue !== defaultValue;

  return (
    <fieldset className="text-left">
      {/* Visually hidden legend for screen readers */}
      <legend className="sr-only">
        <LabelText as="span" value={label} />
      </legend>

      <div className="flex flex-col gap-2">
        {/* Radio list */}
        <div
          aria-live="polite"
          aria-relevant="additions removals"
          className="flex flex-col"
          role="radiogroup"
        >
          {options.map((option) => {
            const isChecked = selectedValue === option.value;
            const radioId = `${fieldsetId}-${option.value}`;

            return (
              <label
                className={`
                  flex cursor-pointer items-center gap-3 rounded-sm py-2
                  focus-within:bg-stripe
                  hover:bg-stripe
                `}
                htmlFor={radioId}
                key={radioId}
              >
                <input
                  checked={isChecked}
                  className="size-4 cursor-pointer accent-accent"
                  id={radioId}
                  name={fieldsetId}
                  onChange={() => handleRadioChange(option.value)}
                  onKeyDown={(e) => handleKeyDown(e, option.value)}
                  type="radio"
                  value={option.value}
                />
                <span className="flex-1 text-sm text-default">
                  {option.label}
                </span>
                <span className="text-sm text-subtle">({option.count})</span>
              </label>
            );
          })}
        </div>

        {/* Clear link */}
        {hasNonDefaultSelection && (
          <div className="flex items-center gap-2 pt-1">
            <button
              aria-label={`Clear ${label} selection`}
              className={`
                text-sm text-accent
                hover:underline
                focus:underline focus:outline-none
              `}
              onClick={handleClear}
              type="button"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </fieldset>
  );
}
