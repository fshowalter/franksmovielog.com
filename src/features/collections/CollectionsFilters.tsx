import { NameFacet } from "~/components/filter-and-sort/facets/name/NameFacet";

import type {
  CollectionsAction,
  CollectionsFiltersValues,
} from "./Collections.reducer";

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
  return <NameFacet defaultValue={filterValues.name} dispatch={dispatch} />;
}
