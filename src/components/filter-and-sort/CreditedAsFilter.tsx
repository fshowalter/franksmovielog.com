import { SelectField } from "~/components/fields/SelectField";
import { capitalize } from "~/utils/capitalize";

/**
 * Filter component for selecting credited roles (e.g., director, writer, performer).
 * @param props - Component props
 * @param props.defaultValue - Currently selected credit value
 * @param props.onChange - Handler for when selection changes
 * @param props.values - List of available credit values
 * @returns Credited as filter select field
 */
export function CreditedAsFilter({
  defaultValue,
  onChange,
  values,
}: {
  defaultValue: string | undefined;
  onChange: (value: string) => void;
  values: readonly string[];
}): React.JSX.Element {
  return (
    <SelectField
      defaultValue={defaultValue}
      label="Credited As"
      onChange={onChange}
    >
      <option value="All">All</option>
      {values.map((credit) => {
        return (
          <option key={credit} value={credit}>
            {capitalize(credit)}
          </option>
        );
      })}
    </SelectField>
  );
}
