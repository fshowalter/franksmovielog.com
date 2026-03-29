import { CreditedAsFacet } from "~/components/filter-and-sort/facets/credited-as/CreditedAsFacet";
import { NameFacet } from "~/components/filter-and-sort/facets/name/NameFacet";

import type { CastAndCrewValue } from "./CastAndCrew";
import type {
  CastAndCrewAction,
  CastAndCrewFiltersValues,
} from "./CastAndCrew.reducer";

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
        defaultValues={filterValues.creditedAs}
        dispatch={dispatch}
        distinctCreditKinds={["director", "performer", "writer"]}
        values={values}
      />
    </>
  );
}
