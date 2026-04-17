import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { PerformersFilterChangedAction } from "./performersReducer";

import { createPerformersCountMap } from "./performersFilter";
import { createPerformersFilterChangedAction } from "./performersReducer";

export function PerformersFacet<
  TValue extends Parameters<typeof createPerformersCountMap>[0][number],
  TFilters extends Parameters<typeof createPerformersCountMap>[1],
>({
  dispatch,
  distinctPerformers,
  filterer,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<PerformersFilterChangedAction>;
  distinctPerformers: readonly string[];
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[];
  filterValues: TFilters;
  values: readonly TValue[];
}): React.JSX.Element {
  const performerCounts = createPerformersCountMap(
    values,
    filterValues,
    filterer,
  );

  return (
    <AnimatedDetailsDisclosure title="Performers">
      <CheckboxListField
        label="Performers"
        onChange={(values) =>
          dispatch(createPerformersFilterChangedAction(values))
        }
        options={distinctPerformers.map((e) => ({
          count: performerCounts?.get(e) ?? 0,
          label: e,
          value: e,
        }))}
        selectedValues={filterValues.performers}
      />
    </AnimatedDetailsDisclosure>
  );
}
