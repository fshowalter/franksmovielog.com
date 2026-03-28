import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { GenresFilterChangedAction } from "./genresReducer";

import { createGenresCountMap } from "./genresFilter";
import { createGenresFilterChangedAction } from "./genresReducer";

export function GenresFacet<
  TValue extends Parameters<typeof createGenresCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  distinctGenres,
  values,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<GenresFilterChangedAction>;
  distinctGenres: readonly string[];
  values: readonly TValue[];
}): React.JSX.Element {
  const genreCounts = createGenresCountMap(values);

  return (
    <AnimatedDetailsDisclosure title="Genres">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Genres"
        onChange={(newValues) =>
          dispatch(createGenresFilterChangedAction(newValues))
        }
        options={distinctGenres.map((e) => ({
          count: genreCounts?.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
