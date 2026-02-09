import type { RadioListFieldOption } from "~/components/fields/RadioListField";

import { RadioListField } from "~/components/fields/RadioListField";
import { FilterSection } from "~/components/filter-and-sort/FilterSection";
import { capitalize } from "~/utils/capitalize";

/**
 * Filter component for selecting credited roles (e.g., director, writer, performer).
 * @param props - Component props
 * @param props.defaultValue - Currently selected credit value
 * @param props.onChange - Handler for when selection changes
 * @param props.values - List of available credit values
 * @param props.counts - Optional map of credit values to their counts
 * @returns Credited as filter with radio list
 */
export function CreditedAsFilter({
  counts,
  defaultValue,
  onChange,
  values,
}: {
  counts?: Map<string, number>;
  defaultValue: string | undefined;
  onChange: (value: string) => void;
  values: readonly string[];
}): React.JSX.Element {
  // Build options with counts
  const allCount = counts
    ? Array.from(counts.values()).reduce((sum, count) => sum + count, 0)
    : 0;

  const options: RadioListFieldOption[] = [
    { count: allCount, label: "All", value: "All" },
    ...values.map((credit) => ({
      count: counts?.get(credit) ?? 0,
      label: capitalize(credit),
      value: credit,
    })),
  ];

  return (
    <FilterSection
      defaultOpen={!!defaultValue && defaultValue !== "All"}
      title="Credited As"
    >
      <RadioListField
        defaultValue={defaultValue ?? "All"}
        label="Credited As"
        onChange={onChange}
        onClear={() => onChange("All")}
        options={options}
      />
    </FilterSection>
  );
}
