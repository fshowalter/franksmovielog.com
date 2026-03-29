import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { CreditedAsFilterChangedAction } from "./creditedAsReducer";

import { createCreditedAsCountMap } from "./creditedAsFilter";
import { createCreditedAsFilterChangedAction } from "./creditedAsReducer";

export function CreditedAsFacet<
  TValue extends Parameters<typeof createCreditedAsCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  distinctCreditKinds,
  values,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<CreditedAsFilterChangedAction>;
  distinctCreditKinds: readonly string[];
  values: readonly TValue[];
}): React.JSX.Element | undefined {
  if (distinctCreditKinds.length < 2) {
    return undefined;
  }

  const creditedAsCounts = createCreditedAsCountMap(values);

  return (
    <AnimatedDetailsDisclosure title="Credited As">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Credited As"
        onChange={(newValues) =>
          dispatch(createCreditedAsFilterChangedAction(newValues))
        }
        options={distinctCreditKinds.map((e) => ({
          count: creditedAsCounts.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
