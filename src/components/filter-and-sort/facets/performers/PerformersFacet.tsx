import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { PerformersFilterChangedAction } from "./performersReducer";

import { createPerformersCountMap } from "./performersFilter";
import { createPerformersFilterChangedAction } from "./performersReducer";

export function PerformersFacet<
  TValue extends Parameters<typeof createPerformersCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  distinctPerformers,
  values,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<PerformersFilterChangedAction>;
  distinctPerformers: readonly string[];
  values: readonly TValue[];
}): React.JSX.Element {
  const performerCounts = createPerformersCountMap(values);

  return (
    <AnimatedDetailsDisclosure title="Performers">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Performers"
        onChange={(values) =>
          dispatch(createPerformersFilterChangedAction(values))
        }
        options={distinctPerformers.map((e) => ({
          count: performerCounts?.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
