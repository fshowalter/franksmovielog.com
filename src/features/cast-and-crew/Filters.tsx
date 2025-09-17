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
          initialValue: filterValues.name,
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
