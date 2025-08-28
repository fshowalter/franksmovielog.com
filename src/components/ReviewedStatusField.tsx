import type { ChangeEvent } from "react";

import { SelectField } from "./SelectField";

export function ReviewedStatusField({
  onChange,
}: {
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <SelectField label="Reviewed Status" onChange={onChange}>
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
