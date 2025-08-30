import { SelectField } from "./SelectField";

export function ReviewedStatusFilter({
  initialValue,
  onChange,
}: {
  initialValue: string | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <SelectField
      initialValue={initialValue}
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
