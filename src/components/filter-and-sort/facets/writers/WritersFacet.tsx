import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { WritersFilterChangedAction } from "./writersReducer";

import { createWritersCountMap } from "./writersFilter";
import { createWritersFilterChangedAction } from "./writersReducer";

export function WritersFacet<
  TValue extends Parameters<typeof createWritersCountMap>[0][number],
  TFilters extends Parameters<typeof createWritersCountMap>[1],
>({
  dispatch,
  distinctWriters,
  filterer,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<WritersFilterChangedAction>;
  distinctWriters: readonly string[];
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[];
  filterValues: TFilters;
  values: readonly TValue[];
}): React.JSX.Element {
  const writerCounts = createWritersCountMap(values, filterValues, filterer);

  return (
    <AnimatedDetailsDisclosure title="Writers">
      <CheckboxListField
        label="Writers"
        onChange={(values) =>
          dispatch(createWritersFilterChangedAction(values))
        }
        options={distinctWriters.map((e) => ({
          count: writerCounts?.get(e) ?? 0,
          label: e,
          value: e,
        }))}
        selectedValues={filterValues.writers}
      />
    </AnimatedDetailsDisclosure>
  );
}
