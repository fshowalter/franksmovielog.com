import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { GenresFilterChangedAction } from "./genresReducer";

import { createGenresCountMap } from "./genresFilter";
import { createGenresFilterChangedAction } from "./genresReducer";

export function GenresFacet<
  TValue extends Parameters<typeof createGenresCountMap>[0][number],
  TFilters extends Parameters<typeof createGenresCountMap>[1],
>({
  dispatch,
  distinctGenres,
  filterer,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<GenresFilterChangedAction>;
  distinctGenres: readonly string[];
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[];
  filterValues: TFilters;
  values: readonly TValue[];
}): React.JSX.Element {
  const genreCounts = createGenresCountMap(values, filterValues, filterer);

  return (
    <AnimatedDetailsDisclosure title="Genres">
      <CheckboxListField
        defaultValues={filterValues.genres}
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
