import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { VenueFilterChangedAction } from "./venueReducer";

import { createVenueCountMap } from "./venueFilter";
import { createVenueFilterChangedAction } from "./venueReducer";

export function VenueFacet<
  TValue extends Parameters<typeof createVenueCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  distinctVenues,
  values,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<VenueFilterChangedAction>;
  distinctVenues: readonly string[];
  values: readonly TValue[];
}): React.JSX.Element {
  const venueCounts = createVenueCountMap(values);

  return (
    <AnimatedDetailsDisclosure title="Venue">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Venue"
        onChange={(values) => dispatch(createVenueFilterChangedAction(values))}
        options={distinctVenues.map((e) => ({
          count: venueCounts.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
