import type { KeyboardEvent } from "react";

import { useEffect, useState } from "react";

import { LabelText } from "./LabelText";

export type CheckboxListFieldOption = {
  count: number;
  label: string;
  value: string;
};

export type CheckboxListFieldProps = {
  defaultValues?: readonly string[];
  label: string;
  onChange: (values: string[]) => void;
  onClear?: () => void;
  options: readonly CheckboxListFieldOption[];
  showMoreThreshold?: number;
};

/**
 * Checkbox list field for multi-selection with show more/less and clear functionality.
 * Selected items automatically move to top of list.
 * @param props - Component props
 * @param props.defaultValues - Default selected values
 * @param props.label - Field label text (visually hidden but accessible)
 * @param props.onChange - Handler for selection changes
 * @param props.onClear - Handler for clear action
 * @param props.options - Available options with labels, values, and counts
 * @param props.showMoreThreshold - Number of items to show before "Show more" (default: 3)
 * @returns Checkbox list field with show more and clear functionality
 */
export function CheckboxListField({
  defaultValues,
  label,
  onChange,
  onClear,
  options,
  showMoreThreshold = 3,
}: CheckboxListFieldProps): React.JSX.Element {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    defaultValues ? [...defaultValues] : [],
  );
  const [showAll, setShowAll] = useState(false);

  // AIDEV-NOTE: Sort options - selected items first (in selection order), then unselected alphabetically
  const sortedOptions = [...options].toSorted((a, b) => {
    const aSelected = selectedValues.includes(a.value);
    const bSelected = selectedValues.includes(b.value);

    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    if (aSelected && bSelected) {
      // Both selected - maintain selection order (most recent first)
      return selectedValues.indexOf(b.value) - selectedValues.indexOf(a.value);
    }
    // Both unselected - alphabetical order
    return a.label.localeCompare(b.label);
  });

  // Determine which options to display
  // AIDEV-NOTE: Always show all selected items + up to showMoreThreshold unselected items
  const shouldShowMore = options.length > showMoreThreshold;
  const selectedCount = selectedValues.length;
  const visibleCount = showAll
    ? sortedOptions.length
    : selectedCount + showMoreThreshold;
  const visibleOptions = sortedOptions.slice(
    0,
    Math.min(visibleCount, sortedOptions.length),
  );
  const hiddenCount = sortedOptions.length - visibleOptions.length;

  const handleCheckboxChange = (value: string, checked: boolean): void => {
    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);

    setSelectedValues(newValues);
    onChange(newValues);
  };

  const handleClear = (): void => {
    setSelectedValues([]);
    onChange([]);
    if (onClear) {
      onClear();
    }
  };

  const handleShowMore = (): void => {
    setShowAll(true);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: string,
  ): void => {
    if (e.key === " ") {
      e.preventDefault();
      const checked = !selectedValues.includes(value);
      handleCheckboxChange(value, checked);
    }
  };

  // AIDEV-NOTE: Sync selectedValues when defaultValues changes from parent
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentionally syncing controlled state from props
    setSelectedValues(defaultValues ? [...defaultValues] : []);
  }, [defaultValues]);

  // AIDEV-NOTE: Listen for form reset events and clear selections when form is reset
  useEffect(() => {
    // Find the parent form element
    const form = document.querySelector("form");
    if (!form) return;

    const handleFormReset = (): void => {
      setSelectedValues(defaultValues ? [...defaultValues] : []);
      setShowAll(false);
    };

    form.addEventListener("reset", handleFormReset);

    return (): void => {
      form.removeEventListener("reset", handleFormReset);
    };
  }, [defaultValues]);

  const fieldsetId = `checkbox-list-${label.toLowerCase().replaceAll(/\s+/g, "-")}`;
  const hasSelections = selectedValues.length > 0;

  return (
    <fieldset
      aria-describedby={hasSelections ? `${fieldsetId}-count` : undefined}
      className="text-left"
    >
      {/* Visually hidden legend for screen readers */}
      <legend className="sr-only">
        <LabelText as="span" value={label} />
      </legend>

      <div className="flex flex-col gap-2">
        {/* Checkbox list */}
        <div
          aria-live="polite"
          aria-relevant="additions removals"
          className="flex flex-col"
          role="group"
        >
          {visibleOptions.map((option) => {
            const isChecked = selectedValues.includes(option.value);
            const checkboxId = `${fieldsetId}-${option.value}`;

            return (
              <label
                className={`
                  flex cursor-pointer items-center gap-3 rounded-sm py-2
                  focus-within:bg-stripe
                  hover:bg-stripe
                `}
                htmlFor={checkboxId}
                key={option.value}
              >
                <input
                  checked={isChecked}
                  className="size-4 cursor-pointer accent-accent"
                  id={checkboxId}
                  onChange={(e) =>
                    handleCheckboxChange(option.value, e.target.checked)
                  }
                  onKeyDown={(e) => handleKeyDown(e, option.value)}
                  type="checkbox"
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

        {/* Show more and Clear links */}
        <div className="flex items-center gap-2 pt-1">
          {shouldShowMore && !showAll && hiddenCount > 0 && (
            <>
              <button
                aria-expanded={showAll}
                className={`
                  text-sm text-accent
                  hover:underline
                  focus:underline focus:outline-none
                `}
                onClick={handleShowMore}
                type="button"
              >
                {/* AIDEV-NOTE: Spec compliance - "Show more" text must have no count */}
                + Show more
              </button>
              {hasSelections && (
                <span aria-hidden="true" className="text-sm text-subtle">
                  |
                </span>
              )}
            </>
          )}
          {hasSelections && (
            <button
              aria-label={`Clear all ${label} selections`}
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
          )}
        </div>

        {/* Selection count for screen readers */}
        {hasSelections && (
          <div className="sr-only" id={`${fieldsetId}-count`}>
            {selectedValues.length}{" "}
            {selectedValues.length === 1 ? "option" : "options"} selected
          </div>
        )}
      </div>
    </fieldset>
  );
}
