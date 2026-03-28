import { AnimatedDetailsDisclosure } from "~/components/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/fields/CheckboxListField";
import { TextField } from "~/components/fields/TextField";
import { capitalize } from "~/utils/capitalize";

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
      <TextField
        defaultValue={filterValues.name}
        label="Name"
        onInputChange={(value) =>
          dispatch(createNameFilterChangedAction(value))
        }
        placeholder="Enter all or part of a name"
      />
      <AnimatedDetailsDisclosure title="Credited As">
        <CheckboxListField
          defaultValues={filterValues.creditedAs ?? []}
          label="Credited As"
          onChange={(values) =>
            dispatch(createCreditedAsFilterChangedAction(values))
          }
          onClear={() => dispatch(createCreditedAsFilterChangedAction([]))}
          options={["director", "performer", "writer"].map((credit) => ({
            count: creditedAsCounts.get(credit) ?? 0,
            label: capitalize(credit),
            value: credit,
          }))}
        />
      </AnimatedDetailsDisclosure>
    </>
  );
}
