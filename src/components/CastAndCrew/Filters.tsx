import type { JSX } from "react";

import type { CollectionFilterValues } from "~/components/CollectionFilters";

import { CollectionFilters } from "~/components/CollectionFilters";
import { CreditedAsFilter } from "~/components/CreditedAsFilter";

import type { ActionType } from "./CastAndCrew.reducer";

import { Actions } from "./CastAndCrew.reducer";

type FilterValues = CollectionFilterValues & {
  creditedAs?: string;
};

export function Filters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  filterValues: FilterValues;
}): JSX.Element {
  return (
    <>
      <CollectionFilters
        filterValues={filterValues}
        onNameChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_NAME, value })
        }
      />
      <CreditedAsFilter
        initialValue={filterValues.creditedAs}
        onChange={(value) =>
          dispatch({
            type: Actions.PENDING_FILTER_CREDIT_KIND,
            value: value,
          })
        }
        values={["director", "performer", "writer"]}
      />
    </>
  );
}
