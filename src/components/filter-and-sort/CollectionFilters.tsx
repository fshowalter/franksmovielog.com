import type { CollectionFiltersValues } from "~/reducers/collectionFiltersReducer";

import { TextField } from "~/components/fields/TextField";

/**
 * Filter controls for collection lists.
 * @param props - Component props
 * @param props.name - Name filter configuration
 * @returns Collection filter controls
 */
export function CollectionFilters({
  name,
}: {
  name: {
    defaultValue: CollectionFiltersValues["name"];
    onChange: (value: string) => void;
  };
}): React.JSX.Element {
  return (
    <>
      <TextField
        defaultValue={name.defaultValue}
        label="Name"
        onInputChange={name.onChange}
        placeholder="Enter all or part of a name"
      />
    </>
  );
}
