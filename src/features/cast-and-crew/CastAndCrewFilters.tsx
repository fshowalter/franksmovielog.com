import { CreditedAsFacet } from "~/components/filter-and-sort/facets/credited-as/CreditedAsFacet";
import { NameFacet } from "~/components/filter-and-sort/facets/name/NameFacet";

import type { CastAndCrewValue } from "./CastAndCrew";
import type {
  CastAndCrewAction,
  CastAndCrewFiltersValues,
} from "./castAndCrewReducer";

import { filterCastAndCrew } from "./filterCastAndCrew";

/**
 * Filter controls for the cast and crew page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.filterValues - Current active filter values
 * @param props.values - All cast and crew values (for count calculation)
 * @returns Filter input components for cast and crew
 */
export function CastAndCrewFilters({
  dispatch,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<CastAndCrewAction>;
  filterValues: CastAndCrewFiltersValues;
  values: readonly CastAndCrewValue[];
}): React.JSX.Element {
  return (
    <>
      <NameFacet defaultValue={filterValues.name} dispatch={dispatch} />
      <CreditedAsFacet
        dispatch={dispatch}
        distinctCreditKinds={["director", "performer", "writer"]}
        filterer={filterCastAndCrew}
        filterValues={filterValues}
        values={values}
      />
    </>
  );
}
