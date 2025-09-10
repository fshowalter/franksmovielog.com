import { SelectField } from "~/components/fields/SelectField";
import { capitalize } from "~/utils/capitalize";

export function CreditedAsFilter({
  initialValue,
  onChange,
  values,
}: {
  initialValue: string | undefined;
  onChange: (value: string) => void;
  values: readonly string[];
}): React.JSX.Element {
  return (
    <SelectField
      initialValue={initialValue}
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
