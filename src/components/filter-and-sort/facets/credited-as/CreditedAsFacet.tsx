import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";
import { capitalize } from "~/utils/capitalize";

import type { CreditedAsFilterChangedAction } from "./creditedAsReducer";

import { createCreditedAsCountMap } from "./creditedAsFilter";
import { createCreditedAsFilterChangedAction } from "./creditedAsReducer";

export function CreditedAsFacet<
  TValue extends Parameters<typeof createCreditedAsCountMap>[0][number],
  TFilters extends Parameters<typeof createCreditedAsCountMap>[1],
>({
  dispatch,
  distinctCreditKinds,
  filterer,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<CreditedAsFilterChangedAction>;
  distinctCreditKinds: readonly string[];
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[];
  filterValues: TFilters;
  values: readonly TValue[];
}): React.JSX.Element | undefined {
  if (distinctCreditKinds.length < 2) {
    return undefined;
  }

  const creditedAsCounts = createCreditedAsCountMap(
    values,
    filterValues,
    filterer,
  );

  return (
    <AnimatedDetailsDisclosure title="Credited As">
      <CheckboxListField
        label="Credited As"
        onChange={(newValues) =>
          dispatch(createCreditedAsFilterChangedAction(newValues))
        }
        options={distinctCreditKinds.map((e) => ({
          count: creditedAsCounts.get(e) ?? 0,
          label: capitalize(e),
          value: e,
        }))}
        selectedValues={filterValues.creditedAs}
      />
    </AnimatedDetailsDisclosure>
  );
}
