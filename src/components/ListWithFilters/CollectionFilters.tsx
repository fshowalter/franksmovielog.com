import { TextField } from "~/components/Fields/TextField";

import type { CollectionFilterValues } from "./collectionsReducerUtils";

export function CollectionFilters({
  name,
}: {
  name: {
    initialValue: CollectionFilterValues["name"];
    onChange: (value: string) => void;
  };
}): React.JSX.Element {
  return (
    <>
      <TextField
        initialValue={name.initialValue}
        label="Name"
        onInputChange={name.onChange}
        placeholder="Enter all or part of a name"
      />
    </>
  );
}
