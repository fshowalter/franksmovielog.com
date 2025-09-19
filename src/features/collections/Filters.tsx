import { CollectionFilters } from "~/components/filter-and-sort/CollectionFilters";

import type {
  CollectionsAction,
  CollectionsFiltersValues,
} from "./Collections.reducer";

import { createNameFilterChangedAction } from "./Collections.reducer";

/**
 * Filter controls for the collections page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.filterValues - Current active filter values
 * @returns Filter input components for collections
 */
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
        defaultValue: filterValues.name,
        onChange: (value) => dispatch(createNameFilterChangedAction(value)),
      }}
    />
  );
}
