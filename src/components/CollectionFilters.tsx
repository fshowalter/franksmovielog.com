import type { JSX } from "react";

import { TextFilter } from "~/components/TextFilter";

export type CollectionFilterValues = {
  name?: string;
};

export function CollectionFilters({
  filterValues,
  onNameChange,
}: {
  filterValues: CollectionFilterValues;
  onNameChange: (value: string) => void;
}): JSX.Element {
  return (
    <>
      {onNameChange && (
        <TextFilter
          initialValue={filterValues.name}
          label="Name"
          onInputChange={onNameChange}
          placeholder="Enter all or part of a name"
        />
      )}
    </>
  );
}
