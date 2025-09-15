import { CollectionFilters } from "~/components/filter-and-sort/CollectionFilters";

import type {
  CollectionsAction,
  CollectionsFiltersValues,
} from "./Collections.reducer";

import { createNameFilterChangedAction } from "./Collections.reducer";

export function Filters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<CollectionsAction>;
  filterValues: CollectionsFiltersValues;
}): React.JSX.Element {
  return (
    <CollectionFilters
      name={{
        initialValue: filterValues.name,
        onChange: (value) => dispatch(createNameFilterChangedAction(value)),
      }}
    />
  );
}
