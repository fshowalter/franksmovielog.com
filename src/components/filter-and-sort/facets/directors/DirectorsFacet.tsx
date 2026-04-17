import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { DirectorsFilterChangedAction } from "./directorsReducer";

import { createDirectorsCountMap } from "./directorsFilter";
import { createDirectorsFilterChangedAction } from "./directorsReducer";

export function DirectorsFacet<
  TValue extends Parameters<typeof createDirectorsCountMap>[0][number],
  TFilters extends Parameters<typeof createDirectorsCountMap>[1],
>({
  dispatch,
  distinctDirectors,
  filterer,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<DirectorsFilterChangedAction>;
  distinctDirectors: readonly string[];
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[];
  filterValues: TFilters;
  values: readonly TValue[];
}): React.JSX.Element {
  const directorCounts = createDirectorsCountMap(
    values,
    filterValues,
    filterer,
  );

  return (
    <AnimatedDetailsDisclosure title="Directors">
      <CheckboxListField
        label="Directors"
        onChange={(newValues) =>
          dispatch(createDirectorsFilterChangedAction(newValues))
        }
        options={distinctDirectors.map((e) => ({
          count: directorCounts?.get(e) ?? 0,
          label: e,
          value: e,
        }))}
        selectedValues={filterValues.directors}
      />
    </AnimatedDetailsDisclosure>
  );
}
