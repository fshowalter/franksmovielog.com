import type { CollectionFiltersValues } from "~/reducers/collectionFiltersReducer";

import { TextField } from "~/components/fields/TextField";

export function CollectionFilters({
  name,
}: {
  name: {
    initialValue: CollectionFiltersValues["name"];
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
