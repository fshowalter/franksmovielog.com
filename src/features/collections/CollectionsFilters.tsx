import { TextField } from "~/components/fields/TextField";

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
export function CollectionsFilters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<CollectionsAction>;
  filterValues: CollectionsFiltersValues;
}): React.JSX.Element {
  return (
    <TextField
      defaultValue={filterValues.name}
      label="Name"
      onInputChange={(value) => dispatch(createNameFilterChangedAction(value))}
      placeholder="Enter all or part of a name"
    />
  );
}
