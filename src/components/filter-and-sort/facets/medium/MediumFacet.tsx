import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { MediumFilterChangedAction } from "./mediumReducer";

import { createMediumCountMap } from "./mediumFilter";
import { createMediumFilterChangedAction } from "./mediumReducer";

export function MediumFacet<
  TValue extends Parameters<typeof createMediumCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  distinctMedia,
  values,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<MediumFilterChangedAction>;
  distinctMedia: readonly string[];
  values: readonly TValue[];
}): React.JSX.Element {
  const mediaCounts = createMediumCountMap(values);

  return (
    <AnimatedDetailsDisclosure title="Medium">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Medium"
        onChange={(values) => dispatch(createMediumFilterChangedAction(values))}
        options={distinctMedia.map((e) => ({
          count: mediaCounts.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
