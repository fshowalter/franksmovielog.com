import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { WritersFilterChangedAction } from "./writersReducer";

import { createWritersCountMap } from "./writersFilter";
import { createWritersFilterChangedAction } from "./writersReducer";

export function WritersFacet<
  TValue extends Parameters<typeof createWritersCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  distinctWriters,
  values,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<WritersFilterChangedAction>;
  distinctWriters: readonly string[];
  values: readonly TValue[];
}): React.JSX.Element {
  const writerCounts = createWritersCountMap(values);

  return (
    <AnimatedDetailsDisclosure title="Writers">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Writers"
        onChange={(values) =>
          dispatch(createWritersFilterChangedAction(values))
        }
        options={distinctWriters.map((e) => ({
          count: writerCounts?.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
