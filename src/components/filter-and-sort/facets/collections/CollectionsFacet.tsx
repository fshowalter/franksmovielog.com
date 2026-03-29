import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { CollectionsFilterChangedAction } from "./collectionsReducer";

import { createCollectionsCountMap } from "./collectionsFilter";
import { createCollectionsFilterChangedAction } from "./collectionsReducer";

export function CollectionsFacet<
  TValue extends Parameters<typeof createCollectionsCountMap>[0][number],
  TFilters extends Parameters<typeof createCollectionsCountMap>[1],
>({
  dispatch,
  distinctCollections,
  filterer,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<CollectionsFilterChangedAction>;
  distinctCollections: readonly string[];
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[];
  filterValues: TFilters;
  values: readonly TValue[];
}): React.JSX.Element {
  const collectionCounts = createCollectionsCountMap(
    values,
    filterValues,
    filterer,
  );

  return (
    <AnimatedDetailsDisclosure title="Collections">
      <CheckboxListField
        defaultValues={filterValues.collections}
        label="Collections"
        onChange={(values) =>
          dispatch(createCollectionsFilterChangedAction(values))
        }
        options={distinctCollections.map((e) => ({
          count: collectionCounts?.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
