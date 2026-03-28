import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { DirectorsFilterChangedAction } from "./directorsReducer";

import { createDirectorsCountMap } from "./directorsFilter";
import { createDirectorsFilterChangedAction } from "./directorsReducer";

export function DirectorsFacet<
  TValue extends Parameters<typeof createDirectorsCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  distinctDirectors,
  values,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<DirectorsFilterChangedAction>;
  distinctDirectors: readonly string[];
  values: readonly TValue[];
}): React.JSX.Element {
  const directorCounts = createDirectorsCountMap(values);

  return (
    <AnimatedDetailsDisclosure title="Directors">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Directors"
        onChange={(newValues) =>
          dispatch(createDirectorsFilterChangedAction(newValues))
        }
        options={distinctDirectors.map((e) => ({
          count: directorCounts?.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
