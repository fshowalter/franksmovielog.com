import { SelectField } from "~/components/Fields/SelectField";

export function ReviewedStatusFilter({
  initialValue,
  onChange,
}: {
  initialValue: string | undefined;
  onChange: (value: string) => void;
}): React.JSX.Element {
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
