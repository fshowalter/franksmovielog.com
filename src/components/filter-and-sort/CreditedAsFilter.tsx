import type { CheckboxListFieldOption } from "~/components/fields/CheckboxListField";

import { CheckboxListField } from "~/components/fields/CheckboxListField";
import { FilterSection } from "~/components/filter-and-sort/FilterSection";
import { capitalize } from "~/utils/capitalize";

/**
 * Filter component for selecting credited roles (e.g., director, writer, performer).
 * Supports multiple selection via checkboxes (matching Orbit DVD pattern).
 * @param props - Component props
 * @param props.defaultValues - Currently selected credit values
 * @param props.onChange - Handler for when selection changes
 * @param props.values - List of available credit values
 * @param props.counts - Optional map of credit values to their counts
 * @returns Credited as filter with checkbox list
 */
export function CreditedAsFilter({
  counts,
  defaultValues,
  onChange,
  values,
}: {
  counts?: Map<string, number>;
  defaultValues: readonly string[];
  onChange: (values: string[]) => void;
  values: readonly string[];
}): React.JSX.Element {
  // Build options with counts (no "All" option - empty selection means all)
  const options: CheckboxListFieldOption[] = values.map((credit) => ({
    count: counts?.get(credit) ?? 0,
    label: capitalize(credit),
    value: credit,
  }));

  return (
    <FilterSection title="Credited As">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Credited As"
        onChange={onChange}
        onClear={() => onChange([])}
        options={options}
      />
    </FilterSection>
  );
}
