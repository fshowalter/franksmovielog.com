import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";
import { createCollectionFilterChangedAction } from "~/features/watchlist/Watchlist.reducer";

import type { CollectionsFilterChangedAction } from "./collectionsReducer";

import { createCollectionsCountMap } from "./collectionsFilter";

export function CollectionsFacet<
  TValue extends Parameters<typeof createCollectionsCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  distinctCollections,
  values,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<CollectionsFilterChangedAction>;
  distinctCollections: readonly string[];
  values: readonly TValue[];
}): React.JSX.Element {
  const collectionCounts = createCollectionsCountMap(values);

  return (
    <AnimatedDetailsDisclosure title="Collections">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Collections"
        onChange={(values) =>
          dispatch(createCollectionFilterChangedAction(values))
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
