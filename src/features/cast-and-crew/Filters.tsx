import { CollectionFilters } from "~/components/filter-and-sort/CollectionFilters";
import { CreditedAsFilter } from "~/components/filter-and-sort/CreditedAsFilter";

import type {
  CastAndCrewAction,
  CastAndCrewFiltersValues,
} from "./CastAndCrew.reducer";

import {
  createCreditedAsFilterChangedAction,
  createNameFilterChangedAction,
} from "./CastAndCrew.reducer";

/**
 * Filter controls for the cast and crew page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.filterValues - Current active filter values
 * @returns Filter input components for cast and crew
 */
export function Filters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<CastAndCrewAction>;
  filterValues: CastAndCrewFiltersValues;
}): React.JSX.Element {
  return (
    <>
      <CollectionFilters
        name={{
          defaultValue: filterValues.name,
          onChange: (value) => dispatch(createNameFilterChangedAction(value)),
        }}
      />
      <CreditedAsFilter
        defaultValue={filterValues.creditedAs}
        onChange={(value) =>
          dispatch(createCreditedAsFilterChangedAction(value))
        }
        values={["director", "performer", "writer"]}
      />
    </>
  );
}
