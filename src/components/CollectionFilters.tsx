import type { CollectionFilterValues } from "~/components/ListWithFilters/collectionsReducerUtils";

import { TextFilter } from "~/components/TextFilter";

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
      <TextFilter
        initialValue={name.initialValue}
        label="Name"
        onInputChange={name.onChange}
        placeholder="Enter all or part of a name"
      />
    </>
  );
}
