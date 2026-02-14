import { CollectionFilters } from "~/components/filter-and-sort/CollectionFilters";
import { CreditedAsFilter } from "~/components/filter-and-sort/CreditedAsFilter";

import type { CastAndCrewValue } from "./CastAndCrew";
import type {
  CastAndCrewAction,
  CastAndCrewFiltersValues,
} from "./CastAndCrew.reducer";

import {
  createCreditedAsFilterChangedAction,
  createNameFilterChangedAction,
} from "./CastAndCrew.reducer";
import { calculateCreditedAsCounts } from "./filterCastAndCrew";

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
  // Calculate dynamic counts for creditedAs filter
  const creditedAsCounts = calculateCreditedAsCounts([...values], filterValues);

  return (
    <>
      <CollectionFilters
        name={{
          defaultValue: filterValues.name,
          onChange: (value) => dispatch(createNameFilterChangedAction(value)),
        }}
      />
      <CreditedAsFilter
        counts={creditedAsCounts}
        defaultValues={filterValues.creditedAs ?? []}
        onChange={(value) =>
          dispatch(createCreditedAsFilterChangedAction(value))
        }
        values={["director", "performer", "writer"]}
      />
    </>
  );
}
