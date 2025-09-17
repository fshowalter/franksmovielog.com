import { SelectField } from "~/components/fields/SelectField";

export function ReviewedStatusFilter({
  defaultValue,
  onChange,
}: {
  defaultValue: string | undefined;
  onChange: (value: string) => void;
}): React.JSX.Element {
  return (
    <SelectField
      defaultValue={defaultValue}
      label="Reviewed Status"
      onChange={onChange}
    >
      <option key={0} value={"All"}>
        All
      </option>
      <option key={1} value={"Reviewed"}>
        Reviewed
      </option>
      <option key={2} value={"Not Reviewed"}>
        Not Reviewed
      </option>
    </SelectField>
  );
}
