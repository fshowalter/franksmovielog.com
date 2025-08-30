import { CollectionFilters } from "~/components/CollectionFilters";
import { CreditedAsFilter } from "~/components/CreditedAsFilter";

import type {
  ActionType,
  CastAndCrewFilterValues,
} from "./CastAndCrew.reducer";

import { Actions } from "./CastAndCrew.reducer";

export function Filters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  filterValues: CastAndCrewFilterValues;
}): React.JSX.Element {
  return (
    <>
      <CollectionFilters
        name={{
          initialValue: filterValues.name,
          onChange: (value) =>
            dispatch({ type: Actions.PENDING_FILTER_NAME, value }),
        }}
      />
      <CreditedAsFilter
        initialValue={filterValues.creditedAs}
        onChange={(value) =>
          dispatch({
            type: Actions.PENDING_FILTER_CREDITED_AS,
            value: value,
          })
        }
        values={["director", "performer", "writer"]}
      />
    </>
  );
}
